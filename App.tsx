
import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { Page, Expert, User, Recipe, StepItem, ChecklistItem } from './types';
import { MOCK_EXPERTS_JA, MOCK_EXPERTS_EN, INITIAL_USER, MOCK_RECIPES_JA, MOCK_RECIPES_EN } from './constants';
import { translations } from './translations';
import Header from './components/Header';
import { LogoIcon, GitHubIcon, GoogleIcon, UserIcon as LoginUserIcon, TagIcon, UserIcon, ClockIcon, IngredientsIcon, StepsIcon, CheckBadgeIcon, AlertTriangleIcon, LightbulbIcon, PaperclipIcon } from './components/icons';
import ExpertListPage from './pages/HomePage';
import ChatPage from './pages/RecipeDetailPage';
import MyAiPage from './pages/MyAiPage';
import HistoryPage from './pages/HistoryPage';
import ChecklistItemComponent from './components/ChecklistItem';
import CreateRecipePage from './pages/CreateRecipePage';


export const LanguageContext = React.createContext<{
  language: 'ja' | 'en';
  setLanguage: (lang: 'ja' | 'en') => void;
}>({ language: 'ja', setLanguage: () => {} });

export const useTranslations = () => {
  const { language } = useContext(LanguageContext);
  return translations[language];
};

export const UserContext = React.createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({ user: null, setUser: () => {} });

export const NavigationContext = React.createContext<{
  navigate: (page: Page, params?: any) => void;
  onSearch: (query: string) => void;
  navigateHome: () => void;
}>({ navigate: () => {}, onSearch: () => {}, navigateHome: () => {} });

interface LoginPageProps {
  onLogin: (method: 'google' | 'github' | 'guest', name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <LogoIcon className="h-16 w-16 text-blue-600 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight mt-4">{t.welcome}</h1>
          <p className="text-lg text-gray-600 mt-2">{t.welcomeSubtitle}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
          <button
            onClick={() => onLogin('google', 'Google User')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon className="w-6 h-6" />
            {t.continueWithGoogle}
          </button>
          <button
            onClick={() => onLogin('github', 'GitHub User')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            <GitHubIcon className="w-6 h-6" />
            {t.continueWithGitHub}
          </button>
          
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">{t.or}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <button
            onClick={() => onLogin('guest', 'Guest')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <LoginUserIcon className="w-6 h-6" />
            {t.continueAsGuest}
          </button>
        </div>
      </div>
    </div>
  );
};

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { navigate } = useContext(NavigationContext);
  return (
    <div
      onClick={() => navigate('recipeDetail', { id: recipe.id })}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{recipe.title}</h3>
            <p className="text-sm font-semibold text-gray-600 flex items-center gap-1 mt-1"><UserIcon className="w-4 h-4" /> {recipe.author}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mt-4 line-clamp-3">
          {recipe.description}
        </p>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <TagIcon className="w-3 h-3 mr-1.5" />
            {recipe.category}
        </span>
      </div>
    </div>
  );
};

const RecipeListPage: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
  const t = useTranslations();
  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t.recipeListTitle}</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">{t.recipeListSubtitle}</p>
        </div>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">{t.noRecipesFound}</p>
          </div>
        )}
      </section>
    </div>
  );
};

const RecipeDetailPage: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const t = useTranslations();
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    const handleToggleChecklist = (id: number) => {
        setCheckedItems(prev => ({...prev, [id]: !prev[id]}));
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                    <TagIcon className="w-4 h-4 mr-1.5" />
                    {recipe.category}
                </span>
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{recipe.title}</h1>
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-1.5 mt-2"><UserIcon className="w-4 h-4" /> {recipe.author}</p>
                <p className="text-gray-700 mt-4">{recipe.description}</p>
            </div>
            
            {recipe.ingredients.length > 0 && (
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4"><IngredientsIcon className="w-6 h-6" /> {t.ingredients}</h2>
                    <div className="space-y-3">
                        {recipe.ingredients.map(item => (
                            <ChecklistItemComponent key={item.id} item={{...item, completed: !!checkedItems[item.id]}} onToggle={() => handleToggleChecklist(item.id)} />
                        ))}
                    </div>
                 </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4"><StepsIcon className="w-6 h-6" /> {t.steps}</h2>
                <div className="space-y-6">
                    {recipe.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-4 border-t pt-6">
                            <div className="flex flex-col items-center">
                                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">{index + 1}</div>
                                {index < recipe.steps.length - 1 && <div className="w-0.5 flex-grow bg-gray-200 mt-2"></div>}
                            </div>
                            <div className="flex-grow pb-4">
                                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                {step.duration && <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1"><ClockIcon className="w-4 h-4" /> {step.duration}</p>}
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{step.details}</p>
                                {step.resources && <div className="mt-3 bg-gray-50 p-3 rounded-lg"><p className="text-sm font-semibold text-gray-600 flex items-center gap-1.5"><PaperclipIcon className="w-4 h-4"/>{t.resourcesPlaceholder}: <span className="font-normal">{step.resources}</span></p></div>}
                                {step.failureTags.length > 0 && (
                                    <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg">
                                        <h4 className="text-sm font-bold text-red-700 flex items-center gap-1.5"><AlertTriangleIcon className="w-4 h-4" />{t.failureTagsLabel}</h4>
                                        <p className="text-sm text-red-600 mt-1">{step.failureTags.join(', ')}</p>
                                    </div>
                                )}
                                {step.alternatives && (
                                    <div className="mt-3 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                        <h4 className="text-sm font-bold text-yellow-700 flex items-center gap-1.5"><LightbulbIcon className="w-4 h-4" />{t.alternativesPlaceholder}</h4>
                                        <p className="text-sm text-yellow-600 mt-1">{step.alternatives}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('expertList');
  const [pageParams, setPageParams] = useState<any>(null);
  const { language } = useContext(LanguageContext);
  const t = useTranslations();
  
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [searchQuery, setSearchQuery] = useState('');

  const displayableExperts = useMemo(() => {
    const baseExperts = language === 'ja' ? MOCK_EXPERTS_JA : MOCK_EXPERTS_EN;
    const userAis = user?.myAis?.filter(ai => ai.status === 'complete') || [];
    
    // Combine base experts and user's AIs, ensuring no duplicates by ID
    const expertMap = new Map<string, Expert>();
    baseExperts.forEach(expert => expertMap.set(expert.id, expert));
    userAis.forEach(ai => expertMap.set(ai.id, ai));
    
    return Array.from(expertMap.values());
  }, [language, user]);
  
  const displayableRecipes = useMemo(() => {
    const baseRecipes = language === 'ja' ? MOCK_RECIPES_JA : MOCK_RECIPES_EN;
    const userRecipes = user?.myRecipes?.filter(r => r.status === 'published') || [];

    const recipeMap = new Map<string, Recipe>();
    baseRecipes.forEach(recipe => recipeMap.set(recipe.id, recipe));
    userRecipes.forEach(recipe => recipeMap.set(recipe.id, recipe));

    return Array.from(recipeMap.values());
  }, [language, user]);

  useEffect(() => {
    // This is a simple migration for users from older app versions
    // who won't have the myRecipes array in their localStorage user object.
    if (user && !user.myRecipes) {
      setUser(currentUser => currentUser ? { ...currentUser, myRecipes: [] } : null);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const navigate = useCallback((page: Page, params: any = null) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  }, []);
  
  const navigateHome = useCallback(() => {
    setSearchQuery('');
    navigate('expertList');
  }, [navigate]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    navigate('expertList');
  }, [navigate]);

  const handleLogin = useCallback((method: 'google' | 'github' | 'guest', name: string) => {
    const guestName = language === 'ja' ? 'ゲスト' : 'Guest';
    const baseName = name.split(" ")[0];
    setUser({ ...INITIAL_USER, name: method === 'guest' ? guestName : baseName, myAis: [], chatHistory: {}, myRecipes: [] });
  }, [language]);
  
  const handleSaveRecipe = (recipeData: Omit<Recipe, 'author' | 'rating' | 'qna' | 'reviews' | 'verificationCount' | 'reproductions'> & { id?: string }) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      const fullRecipe: Recipe = {
        id: recipeData.id || `recipe-${Date.now()}`,
        title: recipeData.title,
        description: recipeData.description,
        category: recipeData.category,
        author: currentUser.name,
        isPremium: recipeData.isPremium,
        status: recipeData.status,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        rating: 0,
        qna: [],
        reviews: [],
        verificationCount: 0,
        reproductions: [],
        conditions: recipeData.conditions,
        attachments: recipeData.attachments,
      };
      
      const existingRecipes = currentUser.myRecipes || [];
      const recipeIndex = existingRecipes.findIndex(r => r.id === fullRecipe.id);

      let updatedRecipes;
      if (recipeIndex > -1) {
        updatedRecipes = [...existingRecipes];
        updatedRecipes[recipeIndex] = fullRecipe;
      } else {
        updatedRecipes = [...existingRecipes, fullRecipe];
      }
        
      const updatedUser = { ...currentUser, myRecipes: updatedRecipes };
      
      let alertMessage = '';
      if (recipeData.status === 'draft') {
          alertMessage = language === 'ja' ? 'レシピが下書きとして保存されました。' : 'Recipe saved as draft.';
      } else if (recipeData.status === 'published') {
          alertMessage = language === 'ja' ? 'レシピが公開されました。' : 'Recipe has been published.';
      }
  
      if (alertMessage) {
        alert(alertMessage);
      }
      
      navigate('recipeList');
      return updatedUser;
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'expertList':
        const filteredExperts = searchQuery
          ? displayableExperts.filter(e => 
              e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (e.bio || '').toLowerCase().includes(searchQuery.toLowerCase())
            )
          : displayableExperts;
        return <ExpertListPage experts={filteredExperts} />;
      case 'recipeList':
        return <RecipeListPage recipes={displayableRecipes} />;
      case 'recipeDetail':
        const recipe = displayableRecipes.find(r => r.id === pageParams.id);
        return recipe ? <RecipeDetailPage recipe={recipe} /> : <div>Recipe not found</div>;
      case 'chat':
        const expert = displayableExperts.find(r => r.id === pageParams.id);
        return expert ? <ChatPage expert={expert} /> : <div>{t.expertNotFound}</div>;
      case 'myAi':
        return <MyAiPage />;
      case 'history':
        return <HistoryPage />;
      case 'recipeEditor':
        return <CreateRecipePage onSaveRecipe={handleSaveRecipe} existingRecipe={pageParams?.recipeData} />;
      default:
        return <ExpertListPage experts={displayableExperts} />;
    }
  };
  
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContext.Provider value={{ navigate, onSearch: handleSearch, navigateHome }}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
            {renderPage()}
          </main>
          <footer className="bg-white border-t py-6">
              <div className="container mx-auto px-4 text-center text-gray-500">
                  <p className="text-sm">&copy; 2024 ReproRecipe. All Rights Reserved.</p>
              </div>
          </footer>
        </div>
      </NavigationContext.Provider>
    </UserContext.Provider>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <AppContent />
    </LanguageContext.Provider>
  );
};

export default App;