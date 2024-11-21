import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, BriefcaseIcon, Building } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import UserMenu from './UserMenu';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, login } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ProConnect</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/opportunities" className="text-gray-700 hover:text-indigo-600">
              Opportunités
            </Link>
            <Link to="/professionals" className="text-gray-700 hover:text-indigo-600">
              Professionnels
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-indigo-600">
              Entreprises
            </Link>
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={login}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/opportunities"
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Opportunités
            </Link>
            <Link
              to="/professionals"
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Professionnels
            </Link>
            <Link
              to="/companies"
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Entreprises
            </Link>
            {user ? (
              <div className="px-3 py-2">
                <UserMenu />
              </div>
            ) : (
              <button
                onClick={() => {
                  login();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}