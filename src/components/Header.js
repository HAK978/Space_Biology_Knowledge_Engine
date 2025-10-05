import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaRocket } from 'react-icons/fa';
import SemanticSearchBar from './SemanticSearchBar';
import SearchResults from './SearchResults';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSemanticSearchOpen, setIsSemanticSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  return (
    <header className="bg-slate-900 border-b border-indigo-800/30 sticky top-0 z-50 shadow-lg shadow-indigo-500/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <FaRocket className="text-nasa-red text-2xl animate-pulse" />
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              NASA Bioscience Explorer
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition">About</Link>
            <button
              onClick={() => setIsSemanticSearchOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/30"
              title="AI-Powered Semantic Search"
            >
              🔍 AI Search
            </button>
          </div>

          <button 
            className="md:hidden text-gray-300 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-3">
              <li><Link to="/" className="block py-2 text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="block py-2 text-gray-300 hover:text-white">About</Link></li>
              <li>
                <button
                  onClick={() => setIsSemanticSearchOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium"
                >
                  🔍 AI Search
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Semantic Search Modal */}
      {isSemanticSearchOpen && (
        <SemanticSearchBar 
          onClose={() => setIsSemanticSearchOpen(false)}
          onSearch={(results) => {
            setSearchResults(results);
            setIsSemanticSearchOpen(false);
          }}
        />
      )}

      {/* Search Results Modal */}
      {searchResults && (
        <SearchResults 
          searchResults={searchResults}
          onClose={() => setSearchResults(null)}
        />
      )}
    </header>
  );
};

export default Header;
