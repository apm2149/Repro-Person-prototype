
import React, { useContext } from 'react';
import { Expert } from '../types';
import { NavigationContext } from '../App';
import { TagIcon, UserIcon, EditIcon, StepsIcon } from './icons';

interface ExpertCardProps {
  expert: Expert;
  onCreateRecipe?: (expertId: string) => void;
  isGeneratingRecipe?: boolean;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onCreateRecipe, isGeneratingRecipe }) => {
  const isDraft = expert.status === 'draft' || !expert.bio;

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col relative"
    >
      {isDraft && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
          <EditIcon className="w-3 h-3" />
          下書き
        </div>
      )}
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <UserIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{expert.name || '（名称未設定）'}</h3>
            <p className="text-sm font-semibold text-gray-600">{expert.title || '（肩書未設定）'}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mt-4 line-clamp-3">
          {isDraft ? '自己紹介文を作成中です...' : expert.bio}
        </p>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              <TagIcon className="w-3 h-3 mr-1.5" />
              {expert.specialty || '（専門分野未設定）'}
          </span>
          {expert.status === 'complete' && onCreateRecipe && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isGeneratingRecipe) {
                  onCreateRecipe(expert.id);
                }
              }}
              disabled={isGeneratingRecipe}
              className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-wait"
            >
              <StepsIcon className="w-3 h-3" />
              {isGeneratingRecipe ? '作成中...' : 'レシピ化'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
