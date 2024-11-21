import React, { useEffect } from 'react';
import { Search, ExternalLink, AlertCircle, Building } from 'lucide-react';
import { useCompanyStore } from '../store/companyStore';
import SearchProgress from '../components/SearchProgress';

export default function Companies() {
  const {
    companies,
    loading,
    error,
    searchTerm,
    directorySources,
    hasSearched,
    setSearchTerm,
    searchCompanies
  } = useCompanyStore();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchCompanies(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchCompanies]);

  const renderSearchStatus = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Recherche d'entreprises en cours...</p>
            <p className="text-sm text-gray-500">Nous consultons plusieurs annuaires pour vous</p>
          </div>
          <SearchProgress sources={directorySources} />
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

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Recherche d'Entreprises</h1>
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {renderSearchStatus()}

      {!loading && !error && companies.length > 0 && (
        <div className="space-y-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Building className="h-6 w-6 text-gray-400" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Source: {company.source}
                      </p>
                    </div>
                  </div>
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                {company.description && (
                  <p className="mt-4 text-gray-600">{company.description}</p>
                )}

                {(company.address || company.phone || company.siret) && (
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    {company.address && (
                      <p>Adresse: {company.address}</p>
                    )}
                    {company.phone && (
                      <p>Téléphone: {company.phone}</p>
                    )}
                    {company.siret && (
                      <p>SIRET: {company.siret}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}