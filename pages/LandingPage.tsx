
import React, { useContext } from 'react';
import { NavigationContext, useTranslations } from '../App';
import { BookOpenIcon, EditIcon } from '../components/icons';

const LandingPage: React.FC = () => {
  const { navigate } = useContext(NavigationContext);
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in py-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          {/* FIX: Used correct translation key. */}
          {t.landingTitle}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {/* FIX: Used correct translation key. */}
          {t.landingSubtitle}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Read Card */}
        <button
          // FIX: Changed navigation to a page type that is now defined.
          onClick={() => navigate('home')}
          className="group text-left p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-blue-500 transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="bg-blue-100 p-4 rounded-xl inline-block group-hover:bg-blue-200 transition-colors">
            <BookOpenIcon className="w-10 h-10 text-blue-600" />
          </div>
          {/* FIX: Used correct translation key. */}
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{t.landingReadTitle}</h2>
          {/* FIX: Used correct translation key. */}
          <p className="mt-2 text-gray-600">{t.landingReadDesc}</p>
        </button>

        {/* Write Card */}
        <button
          // FIX: Changed navigation to a page type that is now defined.
          onClick={() => navigate('recipeAICreator')}
          className="group text-left p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-blue-500 transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="bg-green-100 p-4 rounded-xl inline-block group-hover:bg-green-200 transition-colors">
            <EditIcon className="w-10 h-10 text-green-600" />
          </div>
          {/* FIX: Used correct translation key. */}
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{t.landingWriteTitle}</h2>
          {/* FIX: Used correct translation key. */}
          <p className="mt-2 text-gray-600">{t.landingWriteDesc}</p>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
