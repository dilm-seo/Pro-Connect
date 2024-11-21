import React from 'react';
import { Filter, Euro, MapPin, Calendar } from 'lucide-react';

interface FilterProps {
  filters: {
    platform: string[];
    budget: string[];
    location: string[];
    date: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export default function OpportunityFilters({ filters, onFilterChange, onClearFilters }: FilterProps) {
  const budgetRanges = ['0-30€/h', '30-50€/h', '50-70€/h', '70€+/h'];
  const locations = ['Télétravail', 'Paris', 'Lyon', 'Bordeaux', 'Autres'];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtres
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-indigo-600"
        >
          Réinitialiser
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {budgetRanges.map((range) => (
              <button
                key={range}
                onClick={() => onFilterChange('budget', range)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.budget.includes(range)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Localisation
          </label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => onFilterChange('location', location)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.location.includes(location)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Date
          </label>
          <select
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>
    </div>
  );
}