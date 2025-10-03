
import React, { useContext, useState } from 'react';
import { UserContext, NavigationContext, LanguageContext, useTranslations } from '../App';
import { LogoIcon } from './icons';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    
    const toggleLanguage = () => {
        setLanguage(language === 'ja' ? 'en' : 'ja');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
        >
            {language === 'ja' ? 'English' : '日本語'}
        </button>
    );
};


const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const { navigate, onSearch, navigateHome } = useContext(NavigationContext);
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={navigateHome}
        >
          <LogoIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">ReproRecipe</h1>
        </div>
        <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <input 
                    type="search" 
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button type="submit" className="absolute left-0 top-0 mt-2 ml-3 text-gray-400">
                    <SearchIcon className="w-5 h-5" />
                </button>
            </form>
            <nav className="flex items-center gap-4">
              <LanguageSwitcher />
              <button 
                onClick={navigateHome}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t.expertList}
              </button>
              <button 
                onClick={() => navigate('recipeList')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t.recipeList}
              </button>
              <button 
                onClick={() => navigate('myAi')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t.myAis}
              </button>
              <button 
                onClick={() => navigate('history')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t.history}
              </button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
