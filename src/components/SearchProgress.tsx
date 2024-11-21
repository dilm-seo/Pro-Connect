import React from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface SearchProgressProps {
  sources: {
    name: string;
    status: 'pending' | 'searching' | 'completed' | 'error';
  }[];
}

export default function SearchProgress({ sources }: SearchProgressProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'searching':
        return <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-200" />;
    }
  };

  const completedCount = sources.filter(s => s.status === 'completed').length;
  const totalCount = sources.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progression de la recherche</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        {sources.map((source) => (
          <div key={source.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{source.name}</span>
            </div>
            {getStatusIcon(source.status)}
          </div>
        ))}
      </div>
    </div>
  );
}