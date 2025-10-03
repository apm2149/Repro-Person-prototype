

import React, { useContext, useState } from 'react';
// FIX: Imported newly defined type to resolve error.
import { Recipe } from '../types';
// FIX: Renamed import to ExpertCard to match component name.
import ExpertCard from '../components/RecipeCard';
import { NavigationContext } from '../App';

interface GenrePageProps {
  title: string;
  recipes: Recipe[];
}

const GenrePage: React.FC<GenrePageProps> = ({ title, recipes }) => {
    const { navigate } = useContext(NavigationContext);
    const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
    const [formState, setFormState] = useState({ q1: '', q2: '', q3: ''});

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const getDiagnosisQuestions = () => {
        switch (title) {
            case '受験':
                return {
                    q1: { label: '挑戦の種類は？', options: { 'university': '大学受験', 'qualification': '資格試験', 'study_abroad': '海外留学', 'self_dev': '自己啓発' } },
                    q2: { label: '今の課題は？', options: { 'study_planning': '勉強の計画', 'motivation': 'モチベーション維持', 'info': '情報収集', 'funding': '資金' } },
                    q3: { label: '目指すレベルは？', options: { 'basic': '基礎固め', 'applied': '応用・実践', 'top': 'トップレベル' } },
                };
            case '就職 / バイト':
                return {
                    q1: { label: '探しているのは？', options: { 'job_hunting': '就職活動', 'internship': 'インターン', 'part_time': 'アルバイト', 'entrepreneurship': '起業・独立' } },
                    q2: { label: '興味のある分野は？', options: { 'it': 'IT・テクノロジー', 'social_contribution': '社会貢献・NPO', 'regional': '地域活性化', 'any': '特にない' } },
                    q3: { label: '今のステップは？', options: { 'self_analysis': '自己分析', 'es': '企業研究・ES', 'interview': '面接対策', 'skill_up': '実践・スキルアップ' } },
                };
            case '恋愛':
                 return {
                    q1: { label: '今の状況は？', options: { 'seeking': '出会いがほしい', 'dating': 'デートの悩み', 'deepen': '関係を深めたい', 'community': 'コミュニティ作り' } },
                    q2: { label: 'どんな関係を求めてる？', options: { 'romance': '恋愛関係', 'friendship': '友人関係', 'hobby': '趣味の仲間' } },
                    q3: { label: '課題に感じていることは？', options: { 'communication': 'コミュニケーション', 'self_improvement': '自分磨き', 'date_planning': 'プランニング' } },
                };
            default:
                return null;
        }
    };

    const handleDiagnose = () => {
        let scores: { [key: string]: number } = {};
        recipes.forEach(r => scores[r.id] = 0);

        const keywordsMap: { [key: string]: string[] } = {
            // 受験
            'university': ['共通テスト', '学部選び'], 'qualification': ['TOPIK', '暗記術'], 'study_abroad': ['留学', '語学'],
            'study_planning': ['戦略', '計画'], 'motivation': ['思考法', 'モチベーション'], 'funding': ['奨学金'], 'top': ['オリンピック', '9割'],
            // 就職
            'job_hunting': ['就職活動', 'エントリーシート', '面接'], 'internship': ['インターンシップ'], 'part_time': ['アルバイト'], 'entrepreneurship': ['NPO', 'アプリ開発'],
            'it': ['アプリ開発'], 'social_contribution': ['NPO', '社会貢献'], 'es': ['エントリーシート'], 'interview': ['面接'], 'skill_up': ['アプリ開発'],
            // 恋愛
            'seeking': ['マッチングアプリ', '出会う'], 'dating': ['デート'], 'deepen': ['カップル', '長続き'], 'community': ['コミュニティ', '仲間'],
            'communication': ['会話術', 'コミュニケーション'], 'date_planning': ['プラン'],
        };
        
        Object.values(formState).forEach(value => {
            if (value && keywordsMap[value]) {
                const keywords = keywordsMap[value];
                recipes.forEach(recipe => {
                    keywords.forEach(keyword => {
                        if (recipe.title.includes(keyword) || recipe.description.includes(keyword) || recipe.category.includes(keyword)) {
                            scores[recipe.id]++;
                        }
                    });
                });
            }
        });
        
        const sortedRecipeIds = Object.keys(scores).filter(id => scores[id] > 0).sort((a, b) => scores[b] - scores[a]);
        const top3Recipes = sortedRecipeIds.slice(0, 3).map(id => recipes.find(r => r.id === id)!);
        setRecommendedRecipes(top3Recipes);
        
        // 結果表示位置へスクロール
        const resultElement = document.getElementById('diagnosis-result');
        if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    
    const questions = getDiagnosisQuestions();

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{title}のレシピ一覧</h1>
                <button 
                    // FIX: Changed navigation to a page type that is now defined.
                    onClick={() => navigate('home')}
                    className="text-blue-600 font-semibold hover:underline transition-colors"
                >
                    &larr; ジャンル選択に戻る
                </button>
            </div>
            
            {questions && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">あなたにぴったりのレシピを見つけよう</h2>
                    <p className="text-gray-600 text-center mb-6">いくつかの質問に答えるだけで、おすすめのレシピを提案します。</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* FIX: Cast Object.keys to a typed array to ensure type-safe access to questions and formState. */}
                        {(Object.keys(questions) as Array<keyof typeof questions>).map((key) => {
                            const q = questions[key];
                            return (
                                <div key={key}>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{q.label}</label>
                                    <select name={key} value={formState[key]} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">選択してください</option>
                                        {Object.entries(q.options).map(([value, label]) => <option key={value} value={value}>{String(label)}</option>)}
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center">
                        <button onClick={handleDiagnose} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md">
                            診断する
                        </button>
                    </div>
                </div>
            )}
            
            <div id="diagnosis-result">
                {recommendedRecipes.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">あなたへのおすすめレシピ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedRecipes.map(recipe => (
                                // FIX: Used ExpertCard and mapped recipe properties to expert properties.
                                <ExpertCard key={recipe.id} expert={{id: recipe.id, name: recipe.title, title: recipe.author, specialty: recipe.category, bio: recipe.description, systemInstruction: ''}} />
                            ))}
                        </div>
                        <hr className="my-12 border-gray-300" />
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-6">すべてのレシピ</h2>
                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map(recipe => (
                            // FIX: Used ExpertCard and mapped recipe properties to expert properties.
                            <ExpertCard key={recipe.id} expert={{id: recipe.id, name: recipe.title, title: recipe.author, specialty: recipe.category, bio: recipe.description, systemInstruction: ''}} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 text-lg">このジャンルのレシピはまだありません。</p>
                        <p className="text-gray-500 mt-2">新しいレシピの投稿をお待ちしています！</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenrePage;