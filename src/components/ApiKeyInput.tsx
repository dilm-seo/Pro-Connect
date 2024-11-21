import React, { useState } from 'react';
import { Key, Save, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function ApiKeyInput() {
  const { openaiApiKey, setOpenaiApiKey } = useSettingsStore();
  const [apiKey, setApiKey] = useState(openaiApiKey);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setOpenaiApiKey(apiKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          <Key className="h-4 w-4 mr-2" />
          Clé API OpenAI
        </label>
        {showSuccess && (
          <span className="text-sm text-green-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Clé sauvegardée
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
        <button
          onClick={handleSave}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        La clé API est utilisée pour améliorer la recherche et suggérer des mots-clés pertinents. Elle est stockée uniquement dans votre navigateur.
      </p>
    </div>
  );
}