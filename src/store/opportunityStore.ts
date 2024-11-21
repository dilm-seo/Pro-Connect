import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';
import Parser from 'rss-parser';

const createParser = () => new Parser();

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  platform: string;
  date: string;
  url: string;
  keywords: string[];
  budget?: string;
  location?: string;
}

interface Source {
  name: string;
  status: 'pending' | 'searching' | 'completed' | 'error';
  baseUrl: string;
  searchPath: string;
  rssUrl?: string;
}

const sources: Source[] = [
  { 
    name: 'Malt', 
    status: 'pending', 
    baseUrl: 'https://www.malt.fr',
    searchPath: '/projects/search?keywords=',
    rssUrl: 'https://api.malt.com/rss/missions'
  },
  { 
    name: 'Freelance.com', 
    status: 'pending', 
    baseUrl: 'https://www.freelance.com',
    searchPath: '/fr/mission?search=',
    rssUrl: 'https://www.freelance.com/feed/missions'
  },
  {
    name: 'Indeed',
    status: 'pending',
    baseUrl: 'https://fr.indeed.com',
    searchPath: '/jobs?q=',
    rssUrl: 'https://fr.indeed.com/rss?q='
  },
  {
    name: 'Apec',
    status: 'pending',
    baseUrl: 'https://www.apec.fr',
    searchPath: '/recherche-offre?q=',
    rssUrl: 'https://www.apec.fr/flux-rss/flux-rss.html?motsCles='
  },
  {
    name: 'Pole Emploi',
    status: 'pending',
    baseUrl: 'https://candidat.pole-emploi.fr',
    searchPath: '/offres/recherche?motsCles=',
    rssUrl: 'https://candidat.pole-emploi.fr/offres/flux.rss?motsCles='
  },
  {
    name: 'LinkedIn',
    status: 'pending',
    baseUrl: 'https://www.linkedin.com',
    searchPath: '/jobs/search/?keywords=',
  },
  {
    name: 'Welcome to the Jungle',
    status: 'pending',
    baseUrl: 'https://www.welcometothejungle.com',
    searchPath: '/fr/jobs?query=',
  }
];

const validateUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

const generateSearchUrl = (source: Source, searchTerm: string): string => {
  const encodedTerm = encodeURIComponent(searchTerm);
  return source.rssUrl ? 
    `${source.rssUrl}${encodedTerm}` : 
    `${source.baseUrl}${source.searchPath}${encodedTerm}`;
};

const fetchRSSFeed = async (rssUrl: string): Promise<any[]> => {
  try {
    const parser = createParser();
    const feed = await parser.parseURL(rssUrl);
    return feed.items || [];
  } catch (error) {
    console.error(`Error fetching RSS feed from ${rssUrl}:`, error);
    return [];
  }
};

const analyzeWithGPT = async (content: string, searchTerm: string, apiKey: string): Promise<{
  isRelevant: boolean;
  keywords: string[];
  location?: string;
  budget?: string;
}> => {
  try {
    const prompt = `Analyze this job opportunity for a search term: "${searchTerm}"

Content to analyze:
${content}

Return a JSON object with:
{
  "isRelevant": boolean (true if matches search criteria),
  "keywords": string[] (extracted relevant skills and keywords),
  "location": string (extracted location if found),
  "budget": string (extracted budget/salary if found)
}

Consider:
- Technical skills and variations
- Experience level
- Job type (freelance, CDI, etc.)
- Required qualifications`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.1,
        max_tokens: 200
      }),
    });

    if (!response.ok) return { isRelevant: false, keywords: [] };

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing with GPT:', error);
    return { isRelevant: false, keywords: [] };
  }
};

export const useOpportunityStore = create<OpportunityState>((set, get) => ({
  opportunities: [],
  loading: false,
  error: null,
  searchTerm: '',
  suggestedKeywords: [],
  hasSearched: false,
  sources,
  setSearchTerm: (term) => set({ searchTerm: term }),
  clearError: () => set({ error: null }),
  
  fetchKeywordSuggestions: async (term) => {
    const { openaiApiKey } = useSettingsStore.getState();
    if (!openaiApiKey || !term) return;

    try {
      const prompt = `Pour une recherche d'emploi ou de mission freelance sur "${term}", suggère:
1. 5 mots-clés techniques pertinents
2. 5 variations du poste/titre
3. 3 domaines d'activité liés

Format: JSON avec trois tableaux : "keywords", "titles", "domains"`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 200
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      const suggestions = JSON.parse(data.choices[0].message.content);
      set({ 
        suggestedKeywords: [
          ...suggestions.keywords,
          ...suggestions.titles,
          ...suggestions.domains
        ]
      });
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
    }
  },

  fetchOpportunities: async (term) => {
    const { openaiApiKey } = useSettingsStore.getState();
    if (!openaiApiKey) {
      set({ 
        error: 'Veuillez configurer votre clé API OpenAI pour analyser les opportunités',
        loading: false
      });
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const currentSources = get().sources;
      set({ sources: currentSources.map(s => ({ ...s, status: 'searching' as const })) });

      const opportunities: Opportunity[] = [];

      for (const source of currentSources) {
        try {
          if (source.rssUrl) {
            const rssItems = await fetchRSSFeed(generateSearchUrl(source, term));
            
            for (const item of rssItems) {
              const analysis = await analyzeWithGPT(
                `${item.title}\n${item.contentSnippet || item.content || ''}`,
                term,
                openaiApiKey
              );

              if (analysis.isRelevant) {
                opportunities.push({
                  id: item.guid || `${source.name}-${Date.now()}-${opportunities.length}`,
                  title: item.title,
                  description: item.contentSnippet || item.content || '',
                  platform: source.name,
                  date: item.isoDate || item.pubDate || new Date().toISOString(),
                  url: item.link,
                  keywords: analysis.keywords,
                  location: analysis.location,
                  budget: analysis.budget
                });
              }
            }
          }

          // Ajouter l'URL de recherche directe
          const searchUrl = `${source.baseUrl}${source.searchPath}${encodeURIComponent(term)}`;
          const isValidSearch = await validateUrl(searchUrl);

          if (isValidSearch) {
            opportunities.push({
              id: `${source.name}-search-${Date.now()}`,
              title: `Voir toutes les offres ${term} sur ${source.name}`,
              description: `Accédez à toutes les opportunités ${term} disponibles sur ${source.name}`,
              platform: source.name,
              date: new Date().toISOString(),
              url: searchUrl,
              keywords: term.split(/[\s,]+/).filter(Boolean)
            });
          }

          set({
            sources: get().sources.map(s =>
              s.name === source.name ? 
              { ...s, status: 'completed' as const } : 
              s
            )
          });
        } catch (error) {
          console.error(`Error processing source ${source.name}:`, error);
          set({
            sources: get().sources.map(s =>
              s.name === source.name ? 
              { ...s, status: 'error' as const } : 
              s
            )
          });
        }
      }

      set({ 
        opportunities,
        loading: false,
        hasSearched: true,
        error: opportunities.length === 0 ? 'Aucune opportunité trouvée. Essayez de modifier vos critères de recherche.' : null
      });
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      set({ 
        opportunities: [],
        loading: false,
        hasSearched: true,
        error: 'Erreur lors de la recherche des opportunités. Veuillez réessayer.'
      });
    }
  }
}));