import React, { useEffect, useState } from 'react';
import { Search, ExternalLink, AlertCircle, Tag, Info, MessageSquare } from 'lucide-react';
import { useOpportunityStore } from '../store/opportunityStore';
import { useSettingsStore } from '../store/settingsStore';
import TranslateButton from '../components/TranslateButton';
import OpportunityFilters from '../components/OpportunityFilters';
import ApiKeyInput from '../components/ApiKeyInput';
import SearchProgress from '../components/SearchProgress';
import MessageGenerator from '../components/MessageGenerator';

export default function Opportunities() {
  const { 
    opportunities, 
    loading, 
    error,
    searchTerm, 
    suggestedKeywords,
    hasSearched,
    sources,
    setSearchTerm, 
    fetchOpportunities,
    fetchKeywordSuggestions,
    clearError
  } = useOpportunityStore();

  const [selectedOpportunity, setSelectedOpportunity] = useState<null | {
    title: string;
    description: string;
    platform: string;
    keywords: string[];
  }>(null);

  const [filters, setFilters] = useState({
    platform: [] as string[],
    budget: [] as string[],
    location: [] as string[],
    date: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      platform: [],
      budget: [],
      location: [],
      date: ''
    });
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (filters.budget.length && !filters.budget.some(b => opp.budget?.includes(b))) return false;
    if (filters.location.length && !filters.location.some(l => opp.location?.includes(l))) return false;
    if (filters.date) {
      const oppDate = new Date(opp.date);
      const now = new Date();
      switch (filters.date) {
        case 'today':
          if (oppDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          if (oppDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          if (oppDate < monthAgo) return false;
          break;
      }
    }
    return true;
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchOpportunities(searchTerm);
        fetchKeywordSuggestions(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchOpportunities, fetchKeywordSuggestions]);

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(searchTerm ? `${searchTerm}, ${keyword}` : keyword);
  };

  const renderSearchStatus = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Recherche d'opportunités en cours...</p>
            <p className="text-sm text-gray-500">Nous parcourons plusieurs plateformes pour vous</p>
          </div>
          <SearchProgress sources={sources} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (hasSearched && filteredOpportunities.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center">
            <Info className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune opportunité trouvée</h3>
          <div className="mt-2 text-gray-500">
            <p>Essayez de :</p>
            <ul className="mt-2 list-disc list-inside">
              <li>Vérifier l'orthographe des mots-clés</li>
              <li>Utiliser des termes plus généraux</li>
              <li>Retirer certains filtres</li>
              <li>Utiliser les suggestions de mots-clés proposées</li>
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Opportunités</h1>
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Rechercher des opportunités..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <ApiKeyInput />
        
        {suggestedKeywords.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>Mots-clés suggérés:</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <OpportunityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {renderSearchStatus()}

      {!loading && !error && filteredOpportunities.length > 0 && (
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {opportunity.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{opportunity.platform}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(opportunity.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedOpportunity(opportunity)}
                      className="text-indigo-600 hover:text-indigo-700"
                      title="Générer un message"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    <a
                      href={opportunity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  {opportunity.description}
                  <TranslateButton text={opportunity.description} className="ml-2" />
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {opportunity.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                {(opportunity.budget || opportunity.location) && (
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    {opportunity.budget && (
                      <span>Budget: {opportunity.budget}</span>
                    )}
                    {opportunity.location && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>Localisation: {opportunity.location}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOpportunity && (
        <MessageGenerator
          opportunity={selectedOpportunity}
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
}