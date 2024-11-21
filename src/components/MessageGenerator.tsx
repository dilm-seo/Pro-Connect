import React, { useState } from 'react';
import { MessageSquare, Copy, Loader, X } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

interface MessageGeneratorProps {
  opportunity: {
    title: string;
    description: string;
    platform: string;
    keywords: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: string;
  question: string;
  answer: string;
}

export default function MessageGenerator({ opportunity, isOpen, onClose }: MessageGeneratorProps) {
  const { openaiApiKey } = useSettingsStore();
  const [step, setStep] = useState<'questions' | 'message'>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuestions = async () => {
    setLoading(true);
    setError('');

    try {
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
            content: `Génère 5 questions pertinentes pour aider à personnaliser un message de candidature pour ce poste:
            
Titre: ${opportunity.title}
Description: ${opportunity.description}
Compétences: ${opportunity.keywords.join(', ')}

Format de réponse JSON:
{
  "questions": [
    {
      "id": "string",
      "question": "string"
    }
  ]
}

Les questions doivent aider à:
- Personnaliser le message
- Mettre en avant l'expérience pertinente
- Montrer la motivation
- Adapter le ton au contexte`
          }],
          temperature: 0.7
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération des questions');

      const data = await response.json();
      const parsedQuestions = JSON.parse(data.choices[0].message.content).questions;
      setQuestions(parsedQuestions.map((q: any) => ({ ...q, answer: '' })));
    } catch (err) {
      setError('Erreur lors de la génération des questions. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const generateMessage = async () => {
    setLoading(true);
    setError('');

    try {
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
            content: `Rédige un message de candidature professionnel basé sur ces informations:

Poste: ${opportunity.title}
Description: ${opportunity.description}
Plateforme: ${opportunity.platform}

Réponses aux questions:
${questions.map(q => `Q: ${q.question}\nR: ${q.answer}`).join('\n\n')}

Le message doit:
- Être professionnel mais chaleureux
- Mettre en avant les points clés des réponses
- Être bien structuré
- Inclure une formule de politesse adaptée
- Faire environ 250-300 mots`
          }],
          temperature: 0.7
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération du message');

      const data = await response.json();
      setMessage(data.choices[0].message.content);
      setStep('message');
    } catch (err) {
      setError('Erreur lors de la génération du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
  };

  React.useEffect(() => {
    if (isOpen) {
      generateQuestions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            {step === 'questions' ? 'Questions préalables' : 'Message généré'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">
              {step === 'questions' ? 'Génération des questions...' : 'Rédaction du message...'}
            </p>
          </div>
        ) : step === 'questions' ? (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {q.question}
                </label>
                <textarea
                  value={q.answer}
                  onChange={(e) => setQuestions(questions.map(question =>
                    question.id === q.id ? { ...question, answer: e.target.value } : question
                  ))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
            ))}
            <button
              onClick={generateMessage}
              disabled={questions.some(q => !q.answer.trim())}
              className="w-full mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
            >
              Générer le message
            </button>
          </div>
        ) : (
          <div>
            <div className="prose prose-sm max-w-none mb-4">
              <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                {message}
              </div>
            </div>
            <button
              onClick={copyMessage}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier le message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}