
import React, { useContext } from 'react';
// FIX: Imported newly defined type to resolve error.
import { Recipe } from '../types';
import { NavigationContext } from '../App';
import { UserIcon, TagIcon } from '../components/icons';

interface AdminPageProps {
  recipes: Recipe[];
  onApproveRecipe: (recipeId: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ recipes, onApproveRecipe }) => {
  const { navigate } = useContext(NavigationContext);
  const pendingRecipes = recipes.filter(r => r.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">管理者ダッシュボード</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">承認待ちのレシピ ({pendingRecipes.length})</h2>
        {pendingRecipes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingRecipes.map(recipe => (
              <div key={recipe.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <h3 
                    className="font-bold text-lg text-blue-600 hover:underline cursor-pointer"
                    // FIX: Changed navigation to a page type that is now defined.
                    onClick={() => navigate('recipeDetail', { id: recipe.id })}
                  >
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4" />{recipe.author}</span>
                      <span className="flex items-center gap-1.5"><TagIcon className="w-4 h-4" />{recipe.category}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button 
                    onClick={() => onApproveRecipe(recipe.id)} 
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    承認する
                  </button>
                   <button 
                    onClick={() => alert('否認機能は未実装です')} 
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    否認する
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">承認待ちのレシピはありません。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
