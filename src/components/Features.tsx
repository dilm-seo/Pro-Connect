import React from 'react';
import { Users, Globe, Zap, Shield } from 'lucide-react';

const features = [
  {
    name: 'Recherche Intelligente',
    description: 'Notre système analyse en temps réel les meilleures opportunités correspondant à vos critères sur toutes les plateformes.',
    icon: Users,
  },
  {
    name: 'Multi-Plateformes',
    description: 'Accédez aux offres de Malt, Freelance.com, Comet et bien d\'autres plateformes en un seul endroit.',
    icon: Globe,
  },
  {
    name: 'Mise à Jour en Direct',
    description: 'Recevez instantanément les nouvelles missions correspondant à votre profil et vos préférences.',
    icon: Zap,
  },
  {
    name: 'Liens Vérifiés',
    description: 'Tous les liens sont automatiquement vérifiés pour garantir leur validité et vous faire gagner du temps.',
    icon: Shield,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tout ce dont vous avez besoin
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Notre plateforme vous offre tous les outils nécessaires pour trouver les meilleures opportunités freelance.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}