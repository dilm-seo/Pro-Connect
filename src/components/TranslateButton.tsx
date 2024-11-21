import React, { useState } from 'react';
import { Languages } from 'lucide-react';

interface TranslateButtonProps {
  text: string;
  className?: string;
}

export default function TranslateButton({ text, className = '' }: TranslateButtonProps) {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const translateText = async () => {
    setIsLoading(true);
    try {
      // Using LibreTranslate API - a free and open source machine translation API
      const response = await fetch('https://translate.argosopentech.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: navigator.language.split('-')[0] || 'fr',
        }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation service temporarily unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <button
        onClick={translateText}
        disabled={isLoading}
        className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        title="Translate"
      >
        <Languages className="h-4 w-4 mr-1" />
        {isLoading ? 'Translating...' : 'Translate'}
      </button>
      
      {translatedText && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
          <span className="text-sm text-gray-700">{translatedText}</span>
        </div>
      )}
    </span>
  );
}