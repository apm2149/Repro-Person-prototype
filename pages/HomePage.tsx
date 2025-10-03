
import React, { useContext } from 'react';
import { Expert } from '../types';
import { useTranslations, NavigationContext } from '../App';
import ExpertCard from '../components/RecipeCard';

interface ExpertListPageProps {
  experts: Expert[];
}

const ExpertListPage: React.FC<ExpertListPageProps> = ({ experts }) => {
  const t = useTranslations();
  const { navigate } = useContext(NavigationContext);

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t.expertListTitle}</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">{t.expertListSubtitle}</p>
        </div>
        {experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map(expert => (
              <div key={expert.id} onClick={() => navigate('chat', { id: expert.id })}>
                <ExpertCard expert={expert} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">{t.noExpertsFound}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ExpertListPage;
