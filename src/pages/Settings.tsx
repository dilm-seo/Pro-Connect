import React, { useState } from 'react';
import { Key, Save, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function Settings() {
  const { openaiApiKey, setOpenaiApiKey } = useSettingsStore();
  const [apiKey, setApiKey] = useState(openaiApiKey);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setOpenaiApiKey(apiKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">API Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configure your API keys for enhanced functionality
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>OpenAI API Key</span>
                </div>
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="sk-..."
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Used for search suggestions and keyword expansion. Your API key is stored securely in your browser.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>

            {showSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Settings saved successfully
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}