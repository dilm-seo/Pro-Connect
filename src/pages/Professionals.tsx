import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Star, ExternalLink, Tag } from 'lucide-react';
import { useProfessionalStore } from '../store/professionalStore';
import { useSettingsStore } from '../store/settingsStore';
import TranslateButton from '../components/TranslateButton';

export default function Professionals() {
  const {
    professionals,
    loading,
    error,
    searchTerm,
    suggestedKeywords,
    setSearchTerm,
    fetchProfessionals,
    fetchKeywordSuggestions,
  } = useProfessionalStore();

  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: [] as string[],
    experience: '' as string
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchProfessionals(searchTerm);
        fetchKeywordSuggestions(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProfessionals, fetchKeywordSuggestions]);

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(searchTerm ? `${searchTerm}, ${keyword}` : keyword);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Trouver des Professionnels</h1>
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Rechercher des professionnels par compétence, titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {suggestedKeywords.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>Suggestions:</span>
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

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Recherche de professionnels...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {professional.avatar ? (
                      <img
                        src={professional.avatar}
                        alt={professional.name}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-indigo-600">
                          {professional.name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {professional.name}
                      </h3>
                      <p className="text-sm text-gray-500">{professional.title}</p>
                    </div>
                  </div>
                  <a
                    href={professional.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {professional.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {professional.experience} ans d'expérience
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    {professional.rating} ({professional.reviewCount} avis)
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  {professional.bio}
                  <TranslateButton text={professional.bio} className="ml-2" />
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {professional.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}