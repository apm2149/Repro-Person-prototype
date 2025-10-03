
import React from 'react';
// FIX: Imported newly defined type to resolve error.
import { Recipe } from '../types';
// FIX: Renamed import to ExpertCard to match component name.
import ExpertCard from '../components/RecipeCard';
import { UserIcon, CheckBadgeIcon, TrophyIcon } from '../components/icons';
import { useTranslations } from '../App';

interface CreatorPageProps {
  authorName: string;
  recipes: Recipe[];
}

const CreatorPage: React.FC<CreatorPageProps> = ({ authorName, recipes }) => {
  const t = useTranslations();
  const totalReproductions = recipes.reduce((acc, recipe) => acc + recipe.verificationCount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <UserIcon className="w-16 h-16 text-blue-600" />
          </div>
          <div>
            {/* FIX: Used correct translation key. */}
            <p className="text-sm font-semibold text-gray-500 text-center sm:text-left">{t.author}</p>
            <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-left">{authorName}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-2 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-green-500"/>
                {/* FIX: Used correct translation key. */}
                <span>{t.recipesCreated}: <strong>{recipes.length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-500"/>
                {/* FIX: Used correct translation key. */}
                <span>{t.totalReproductions}: <strong>{totalReproductions}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* FIX: Used correct translation key. */}
        <h2 className="text-3xl font-bold text-gray-800">{authorName}{t.sRecipes}</h2>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              // FIX: Used ExpertCard and mapped recipe properties to expert properties.
              <ExpertCard key={recipe.id} expert={{id: recipe.id, name: recipe.title, title: recipe.author, specialty: recipe.category, bio: recipe.description, systemInstruction: ''}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              {/* FIX: Used correct translation key. */}
              <p className="text-gray-500 text-lg">{t.noRecipesByAuthor}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorPage;
