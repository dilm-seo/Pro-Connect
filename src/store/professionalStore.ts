import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';

interface Professional {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  location: string;
  experience: number;
  rating: number;
  reviewCount: number;
  skills: string[];
  profileUrl: string;
}

interface ProfessionalState {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  suggestedKeywords: string[];
  hasSearched: boolean;
  setSearchTerm: (term: string) => void;
  fetchProfessionals: (term: string) => Promise<void>;
  fetchKeywordSuggestions: (term: string) => Promise<void>;
}

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    title: 'Développeur Full Stack Senior',
    bio: 'Plus de 10 ans d\'expérience en développement web avec une expertise en React et Node.js',
    location: 'Paris, France',
    experience: 10,
    rating: 4.9,
    reviewCount: 127,
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    profileUrl: 'https://example.com/profile/1'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useProfessionalStore = create<ProfessionalState>((set) => ({
  professionals: [],
  loading: false,
  error: null,
  searchTerm: '',
  suggestedKeywords: [],
  hasSearched: false,
  setSearchTerm: (term) => set({ searchTerm: term }),

  fetchKeywordSuggestions: async (term) => {
    const { openaiApiKey } = useSettingsStore.getState();
    if (!openaiApiKey || !term) return;

    try {
      const prompt = `Domaine: ${term}
Tâche: Générer 5 compétences techniques ou spécialités professionnelles
Format: compétences séparées par des virgules
Contraintes: français uniquement, termes techniques acceptés`;

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
          max_tokens: 50,
          presence_penalty: 0.1
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      const keywords = data.choices[0].message.content.split(',').map((k: string) => k.trim());
      set({ suggestedKeywords: keywords });
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
    }
  },

  fetchProfessionals: async (term) => {
    set({ loading: true, error: null });
    
    try {
      await delay(Math.random() * 1000 + 500);

      const searchTerms = term.toLowerCase().split(/[\s,]+/).filter(Boolean);
      
      const filteredProfessionals = mockProfessionals.filter(prof => {
        const searchableText = [
          prof.name,
          prof.title,
          prof.bio,
          prof.location,
          ...prof.skills
        ].join(' ').toLowerCase();

        return searchTerms.some(term => searchableText.includes(term));
      });

      set({ 
        professionals: filteredProfessionals,
        loading: false,
        hasSearched: true
      });
    } catch (error) {
      console.error('Error fetching professionals:', error);
      set({ 
        professionals: [],
        loading: false,
        hasSearched: true,
        error: 'Échec de la récupération des professionnels. Veuillez réessayer plus tard.'
      });
    }
  }
}));