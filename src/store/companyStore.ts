import { create } from 'zustand';

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  address?: string;
  phone?: string;
  email?: string;
  siret?: string;
  source: string;
  url: string;
}

interface DirectorySource {
  name: string;
  baseUrl: string;
  searchPath: string;
  status: 'pending' | 'searching' | 'completed' | 'error';
}

const directorySources: DirectorySource[] = [
  {
    name: 'Societe.com',
    baseUrl: 'https://www.societe.com',
    searchPath: '/cgi-bin/search?champs=',
    status: 'pending'
  },
  {
    name: 'Infogreffe',
    baseUrl: 'https://www.infogreffe.fr',
    searchPath: '/entreprise-societe/recherche?terme=',
    status: 'pending'
  },
  {
    name: 'Pages Jaunes',
    baseUrl: 'https://www.pagesjaunes.fr',
    searchPath: '/recherche?q=',
    status: 'pending'
  },
  {
    name: 'Verif.com',
    baseUrl: 'https://www.verif.com',
    searchPath: '/recherche?search=',
    status: 'pending'
  }
];

interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  directorySources: DirectorySource[];
  hasSearched: boolean;
  setSearchTerm: (term: string) => void;
  searchCompanies: (term: string) => Promise<void>;
  clearError: () => void;
}

const validateUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

const generateSearchUrl = (source: DirectorySource, searchTerm: string): string => {
  const encodedTerm = encodeURIComponent(searchTerm);
  return `${source.baseUrl}${source.searchPath}${encodedTerm}`;
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  loading: false,
  error: null,
  searchTerm: '',
  directorySources,
  hasSearched: false,

  setSearchTerm: (term) => set({ searchTerm: term }),
  clearError: () => set({ error: null }),

  searchCompanies: async (term) => {
    set({ loading: true, error: null });

    try {
      const currentSources = get().directorySources;
      set({ 
        directorySources: currentSources.map(s => ({ ...s, status: 'searching' }))
      });

      const companies: Company[] = [];

      for (const source of currentSources) {
        const url = generateSearchUrl(source, term);
        const isValid = await validateUrl(url);

        if (isValid) {
          companies.push({
            id: `${source.name}-${Date.now()}`,
            name: term,
            description: `Consultez les informations de l'entreprise sur ${source.name}`,
            website: url,
            source: source.name,
            url: url
          });
        }

        set({
          directorySources: get().directorySources.map(s =>
            s.name === source.name ? 
            { ...s, status: isValid ? 'completed' : 'error' } : 
            s
          )
        });
      }

      set({ 
        companies,
        loading: false,
        hasSearched: true,
        error: companies.length === 0 ? 'Aucune entreprise trouvée. Vérifiez le nom ou essayez une autre recherche.' : null
      });
    } catch (error) {
      console.error('Error searching companies:', error);
      set({ 
        companies: [],
        loading: false,
        hasSearched: true,
        error: 'Erreur lors de la recherche des entreprises. Veuillez réessayer.'
      });
    }
  }
}));