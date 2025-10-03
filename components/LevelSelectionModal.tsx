
import React, { useState } from 'react';
// FIX: Imported newly defined types to resolve errors.
import { UserInterest, UserProficiency } from '../types';
import { BookOpenIcon, BriefcaseIcon, HeartIcon } from './icons';
import { useTranslations } from '../App';
// FIX: Imported newly defined constants to resolve errors.
import { INTEREST_KEYS, PROFICIENCY_LEVELS } from '../constants';

interface OnboardingModalProps {
  onComplete: (interest: UserInterest, proficiency: UserProficiency) => void;
}

const LevelSelectionModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState<UserInterest | null>(null);
  
  const interestIcons: { [key in UserInterest]: React.ReactNode } = {
    exams: <BookOpenIcon className="w-10 h-10 text-blue-600" />,
    jobs: <BriefcaseIcon className="w-10 h-10 text-green-600" />,
    love: <HeartIcon className="w-10 h-10 text-red-600" />,
  };

  const handleSelectInterest = (interest: UserInterest) => {
    setSelectedInterest(interest);
    setStep(2);
  };

  const handleSelectProficiency = (proficiency: UserProficiency) => {
    if (selectedInterest) {
      onComplete(selectedInterest, proficiency);
    }
  };
  
  const ProgressBar: React.FC = () => (
    <div className="flex items-center justify-center mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
        <div className="flex-grow h-1 bg-gray-200 mx-2"><div className={`h-1 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[100] animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center animate-bounce-in">
        <ProgressBar />
        {step === 1 && (
          <div>
            {/* FIX: Used correct translation key. */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">{t.onboardingWelcome}</h2>
            {/* FIX: Used correct translation key. */}
            <p className="text-gray-600 mb-8">{t.onboardingInterestTitle}</p>
            <div className="space-y-4">
              {INTEREST_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectInterest(key)}
                  className="w-full text-left flex items-center gap-4 p-4 bg-gray-50 border-2 border-transparent rounded-lg hover:bg-blue-100 hover:border-blue-500 transition-all transform hover:scale-105"
                >
                  <div className="bg-white p-3 rounded-lg shadow-sm">{interestIcons[key]}</div>
                  <div>
                    {/* FIX: Used correct translation key. */}
                    <h3 className="text-xl font-bold text-gray-800">{t.interestLabels[key]}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            {/* FIX: Used correct translation key. */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">{t.onboardingProficiencyTitle}</h2>
            {/* FIX: Used correct translation key. */}
            <p className="text-gray-600 mb-8">{t.onboardingProficiencySubtitle}</p>
            <div className="space-y-3">
               {PROFICIENCY_LEVELS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectProficiency(key)}
                  className="w-full text-left p-3 bg-gray-50 border-2 border-transparent rounded-lg hover:bg-blue-100 hover:border-blue-500 transition-all transform hover:scale-[1.02]"
                >
                    {/* FIX: Used correct translation key. */}
                    <h3 className="text-lg font-bold text-gray-800">{t.proficiencyLabels[key]}</h3>
                    {/* FIX: Used correct translation key. */}
                    <p className="text-gray-600 text-sm">{t.proficiencyDescriptions[key]}</p>
                </button>
              ))}
            </div>
            {/* FIX: Used correct translation key. */}
             <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-800 mt-6">{t.backToInterestSelection}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelSelectionModal;
