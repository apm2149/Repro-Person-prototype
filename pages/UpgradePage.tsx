
import React, { useState } from 'react';
import { CrownIcon } from '../components/icons';

interface UpgradePageProps {
  onUpgrade: () => void;
}

const features = [
  { name: 'フリーレシピ閲覧', free: true, premium: true },
  { name: 'プレミアムレシピ閲覧', free: false, premium: true },
  { name: 'レシピのブックマーク', free: true, premium: true },
  { name: 'レシピ投稿（収益化なし）', free: false, premium: false },
  { name: 'レシピ投稿（収益化あり）', free: false, premium: true },
  { name: 'コミュニティへの参加', free: true, premium: true },
  { name: 'AIアシスタント機能', free: false, premium: true },
];

const Checkmark: React.FC<{ available: boolean }> = ({ available }) => (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${available ? 'bg-green-500' : 'bg-gray-300'}`}>
        {available ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        )}
    </div>
);


const UpgradePage: React.FC<UpgradePageProps> = ({ onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">プレミアムプランにアップグレード</h1>
        <p className="text-lg text-gray-600 mt-2">
          あなたの挑戦を最大限に加速させるための全機能を開放しましょう。
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="font-bold text-lg text-left">機能</div>
                <div className="font-bold text-lg">フリー</div>
                <div className="font-bold text-lg text-blue-600 flex items-center justify-center gap-2"><CrownIcon className="w-5 h-5 text-yellow-500"/>プレミアム</div>
            </div>
        </div>

        <div className="divide-y divide-gray-200">
            {features.map((feature) => (
                <div key={feature.name} className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-700 text-left">{feature.name}</div>
                    <div className="flex justify-center">
                        {typeof feature.free === 'boolean' ? <Checkmark available={feature.free} /> : <span className="text-sm text-gray-600">{feature.free}</span>}
                    </div>
                    <div className="flex justify-center">
                        <Checkmark available={feature.premium} />
                    </div>
                </div>
            ))}
        </div>
        
        <div className="p-8 bg-gray-50">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">プランを選択</h3>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
                <div 
                    onClick={() => setSelectedPlan('monthly')}
                    className={`border-2 rounded-lg p-6 text-center w-full md:w-1/2 transform transition-all hover:scale-105 cursor-pointer ${
                        selectedPlan === 'monthly' ? 'border-blue-500 scale-105 shadow-lg' : 'border-gray-300 hover:border-blue-500'
                    }`}
                >
                    <h4 className="text-xl font-bold text-gray-800">月額プラン</h4>
                    <p className="text-4xl font-extrabold my-3 text-gray-800">¥500 <span className="text-lg font-medium text-gray-600">/ 月</span></p>
                </div>
                 <div 
                    onClick={() => setSelectedPlan('yearly')}
                    className={`border-2 rounded-lg p-6 text-center w-full md:w-1/2 relative transform transition-all hover:scale-105 cursor-pointer ${
                        selectedPlan === 'yearly' ? 'border-blue-500 scale-105 shadow-lg' : 'border-gray-300 hover:border-blue-500'
                    }`}
                 >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                        2ヶ月分お得！
                    </span>
                    <h4 className="text-xl font-bold text-gray-800">年額プラン</h4>
                    <p className="text-4xl font-extrabold my-3 text-gray-800">¥5,000 <span className="text-lg font-medium text-gray-600">/ 年</span></p>
                </div>
            </div>
            <div className="mt-8 text-center">
                 <button
                  onClick={onUpgrade}
                  className="w-full max-w-md bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors text-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl"
                >
                  {selectedPlan === 'monthly' ? '月額プランで登録' : '年額プランで登録'}
                </button>
                <p className="text-xs text-gray-500 mt-3">いつでもキャンセルできます。</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
