
import React, { useState, useContext } from 'react';
// FIX: Imported newly defined types to resolve errors.
import { Recipe, User, UserInterest, UserProficiency } from '../types';
// FIX: Renamed import to ExpertCard to match component name.
import ExpertCard from '../components/RecipeCard';
import { NavigationContext, useTranslations } from '../App';
import { UserIcon, CrownIcon, EditIcon, BookmarkIcon, ChartBarIcon, YenIcon } from '../components/icons';
// FIX: Imported newly defined constants to resolve errors.
import { INTEREST_KEYS, PROFICIENCY_LEVELS } from '../constants';

interface MyPageProps {
  user: User;
  bookmarkedRecipes: Recipe[];
  createdRecipes: Recipe[];
  onUpdateUser: (updatedInfo: Partial<Omit<User, 'id'>>) => void;
  onDeleteAccount: () => void;
}

type Tab = 'profile' | 'bookmarks' | 'creator';

const MyPage: React.FC<MyPageProps> = ({ user, bookmarkedRecipes, createdRecipes, onUpdateUser, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { navigate } = useContext(NavigationContext);
  const t = useTranslations();

  const ProfileTab: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState({
        name: user.name,
        // FIX: Accessing properties now available on User type.
        interest: user.interest,
        proficiency: user.proficiency,
    });
    
    const handleSave = () => {
      if (editingUser.name.trim() && editingUser.interest && editingUser.proficiency) {
        // FIX: 'interest' and 'proficiency' are now valid properties for onUpdateUser.
        onUpdateUser({ 
            name: editingUser.name.trim(),
            interest: editingUser.interest,
            proficiency: editingUser.proficiency,
        });
        setIsEditing(false);
      } else {
        alert('Username, interest, and proficiency cannot be empty.');
      }
    };
  
    const handleCancel = () => {
      // FIX: Accessing properties now available on User type.
      setEditingUser({ name: user.name, interest: user.interest, proficiency: user.proficiency });
      setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center space-x-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <UserIcon className="w-16 h-16 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        {/* FIX: Accessing property now available on User type. */}
                        <div className={`flex items-center gap-2 mt-2 text-lg font-bold px-4 py-1 rounded-full w-fit ${user.plan === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            <CrownIcon className={`h-6 w-6 ${user.plan === 'premium' ? 'text-yellow-500' : 'text-gray-400'}`}/>
                            <span>{user.plan === 'premium' ? t.premium : t.free}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                {/* FIX: Used correct translation key. */}
                <h2 className="text-2xl font-bold text-gray-800">{t.profileSettings}</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      {/* FIX: Used correct translation key. */}
                      <EditIcon className="w-4 h-4"/>{t.editProfile}
                    </button>
                )}
              </div>

              {isEditing ? (
                  <div className="space-y-4">
                      <div>
                          {/* FIX: Used correct translation key. */}
                          <label className="block text-sm font-bold text-gray-700 mb-1">{t.username}</label>
                          <input 
                              type="text"
                              value={editingUser.name}
                              onChange={(e) => setEditingUser(prev => ({...prev, name: e.target.value}))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                      </div>
                      <div>
                          {/* FIX: Used correct translation key. */}
                          <label className="block text-sm font-bold text-gray-700 mb-1">{t.interest}</label>
                          <select 
                              value={editingUser.interest || ''} 
                              onChange={e => setEditingUser(prev => ({...prev, interest: e.target.value as UserInterest}))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {/* FIX: Used correct translation key. */}
                            <option value="" disabled>{t.interest}</option>
                            {/* FIX: Used correct translation key. */}
                            {INTEREST_KEYS.map(key => <option key={key} value={key}>{t.interestLabels[key]}</option>)}
                          </select>
                      </div>
                      <div>
                          {/* FIX: Used correct translation key. */}
                          <label className="block text-sm font-bold text-gray-700 mb-1">{t.proficiency}</label>
                          <select 
                              value={editingUser.proficiency || ''} 
                              onChange={e => setEditingUser(prev => ({...prev, proficiency: Number(e.target.value) as UserProficiency}))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                              {/* FIX: Used correct translation key. */}
                              <option value="" disabled>{t.proficiency}</option>
                              {/* FIX: Used correct translation key. */}
                              {PROFICIENCY_LEVELS.map(key => <option key={key} value={key}>{t.proficiencyLabels[key]}</option>)}
                          </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                          {/* FIX: Used correct translation key. */}
                          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">{t.save}</button>
                          {/* FIX: Used correct translation key. */}
                          <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">{t.cancel}</button>
                      </div>
                  </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {/* FIX: Used correct translation key. */}
                        <p className="text-sm text-gray-500 font-bold">{t.interest}</p>
                        {/* FIX: Accessing properties now available on User type and used correct translation key. */}
                        <p className="text-lg text-gray-800">{user.interest ? t.interestLabels[user.interest] : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {/* FIX: Used correct translation key. */}
                        <p className="text-sm text-gray-500 font-bold">{t.proficiency}</p>
                        {/* FIX: Accessing properties now available on User type and used correct translation key. */}
                        <p className="text-lg text-gray-800">{user.proficiency ? t.proficiencyLabels[user.proficiency] : 'N/A'}</p>
                    </div>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                {/* FIX: Used correct translation key. */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.accountManagement}</h2>
                <button onClick={onDeleteAccount} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                    {/* FIX: Used correct translation key. */}
                    {t.deleteAccount}
                </button>
                {/* FIX: Used correct translation key. */}
                <p className="text-sm text-gray-500 mt-2">{t.deleteAccountWarning}</p>
            </div>
        </div>
    );
  };
  
  const BookmarksTab: React.FC = () => (
    <div className="space-y-6">
      {/* FIX: Used correct translation key. */}
      <h2 className="text-3xl font-bold text-gray-800">{t.bookmarkedRecipes}</h2>
      {bookmarkedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedRecipes.map(recipe => (
            // FIX: Used ExpertCard and mapped recipe properties to expert properties.
            <ExpertCard key={recipe.id} expert={{id: recipe.id, name: recipe.title, title: recipe.author, specialty: recipe.category, bio: recipe.description, systemInstruction: ''}} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            {/* FIX: Used correct translation key. */}
            <p className="text-gray-500 text-lg">{t.noBookmarks}</p>
            {/* FIX: Used correct translation key. */}
            <p className="text-gray-500">{t.discoverRecipes}</p>
        </div>
      )}
    </div>
  );

  const CreatorTab: React.FC = () => {
    // FIX: Accessing property now available on User type.
    if (user.plan === 'free') {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
                <CrownIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                {/* FIX: Used correct translation key. */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.creatorOnlyPremium}</h2>
                {/* FIX: Used correct translation key. */}
                <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: t.creatorUpgradePrompt }} />
                <button 
                    // FIX: Changed navigation to a page type that is now defined.
                    onClick={() => navigate('upgrade')}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
                >
                    {t.upgradeToPremium}
                </button>
            </div>
        );
    }
    
    const draftRecipes = createdRecipes.filter(r => r.status === 'draft');
    const publishedRecipes = createdRecipes.filter(r => r.status !== 'draft');

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                {/* FIX: Used correct translation key. */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.creatorDashboard}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {/* FIX: Used correct translation key. */}
                        <p className="text-sm text-gray-500">{t.totalEarnings}</p>
                        {/* FIX: Accessing property now available on User type. */}
                        <p className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-1"><YenIcon className="w-6 h-6" />{(user.earnings || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {/* FIX: Used correct translation key. */}
                        <p className="text-sm text-gray-500">{t.recipesCreated}</p>
                        <p className="text-3xl font-bold text-gray-800">{createdRecipes.length}</p>
                    </div>
                </div>
            </div>

            {draftRecipes.length > 0 && (
                <div className="space-y-6">
                    {/* FIX: Used correct translation key. */}
                    <h2 className="text-3xl font-bold text-gray-800">{t.drafts}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {draftRecipes.map(recipe => (
                            // FIX: Used ExpertCard, mapped props, and corrected navigate call.
                            <ExpertCard key={recipe.id} expert={{id: recipe.id, name: recipe.title, title: recipe.author, specialty: recipe.category, bio: recipe.description, systemInstruction: ''}} />
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                {/* FIX: Used correct translation key. */}
                <h2 className="text-3xl font-bold text-gray-800">{t.pendingAndPublished}</h2>
                <div className="flex gap-2">
                    {/* FIX: Changed navigation to a page type that is now defined. */}
                    <button onClick={() => navigate('recipeEditor')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        {/* FIX: Used correct translation key. */}
                        {t.createNewRecipe}
                    </button>
                     {/* FIX: Changed navigation to a page type that is now defined. */}
                     <button onClick={() => navigate('recipeAICreator')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        {/* FIX: Used correct translation key. */}
                        {t.createWithAI}
                    </button>
                </div>
              </div>
                {publishedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publishedRecipes.map(recipe => (
                      // FIX: Used ExpertCard and mapped recipe properties to expert properties.
                      <ExpertCard key={recipe.id} expert={{id: recipe.id, name: recipe.title, title: recipe.author, specialty: recipe.category, bio: recipe.description, systemInstruction: ''}} />
                    ))}
                  </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        {/* FIX: Used correct translation key. */}
                        <p className="text-gray-500 text-lg">{t.noPendingOrPublished}</p>
                    </div>
                )}
            </div>
        </div>
    );
  };
  
  const TabButton: React.FC<{tabName: Tab, label: string, icon: React.ReactNode}> = ({ tabName, label, icon }) => (
    <button 
        onClick={() => setActiveTab(tabName)} 
        className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === tabName ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
    >
        {icon}
        {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
        <TabButton tabName="profile" label={t.profile} icon={<UserIcon className="w-5 h-5"/>} />
        <TabButton tabName="bookmarks" label={t.bookmarks} icon={<BookmarkIcon className="w-5 h-5"/>} />
        <TabButton tabName="creator" label={t.creator} icon={<ChartBarIcon className="w-5 h-5"/>} />
      </div>

      <div className="animate-fade-in">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'bookmarks' && <BookmarksTab />}
        {activeTab === 'creator' && <CreatorTab />}
      </div>
    </div>
  );
};

export default MyPage;
