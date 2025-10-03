
import React, { useState, useContext, useRef, useEffect } from 'react';
// FIX: Imported newly defined types to resolve errors.
import { Recipe, StepItem, ChecklistItem } from '../types';
import { NavigationContext, useTranslations, LanguageContext } from '../App';
// FIX: Imported newly implemented mock functions to resolve errors.
import { getAIRecipeAssistance, cleanAndParseJson } from '../services/geminiService';
import { BotIcon, SendIcon } from '../components/icons';

interface AIChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const CreateRecipeAIPage: React.FC = () => {
  const t = useTranslations();
  const { language } = useContext(LanguageContext);
  const { navigate } = useContext(NavigationContext);

  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
    // FIX: Used correct translation key.
    { sender: 'bot', text: t.aiCreatorInitialMessage },
  ]);
  const [recipeData, setRecipeData] = useState<Partial<Recipe>>({});
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newUserMessage: AIChatMessage = { sender: 'user', text: userInput };
    const currentChatHistory = [...chatHistory, newUserMessage];
    setChatHistory(currentChatHistory);
    setUserInput('');
    setIsLoading(true);

    try {
        const responseText = await getAIRecipeAssistance(currentChatHistory, recipeData, language);
        const responseData = cleanAndParseJson(responseText);

        setRecipeData(responseData.updatedRecipe || recipeData);
        setChatHistory(prev => [...prev, { sender: 'bot', text: responseData.nextBotMessage }]);

    } catch (error) {
        console.error("Failed to get response from AI assistant", error);
        // FIX: Used correct translation key.
        setChatHistory(prev => [...prev, { sender: 'bot', text: t.aiCreatorGenericError }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFinalize = () => {
    const finalRecipeData: Omit<Recipe, 'author' | 'rating' | 'qna' | 'reviews' | 'verificationCount' | 'reproductions'> = {
        id: `recipe-${Date.now()}`,
        title: recipeData.title || '',
        description: recipeData.description || '',
        category: recipeData.category || '',
        isPremium: recipeData.isPremium || false,
        status: 'draft',
        ingredients: (recipeData.ingredients || []).map((item, index) => ({ id: index + 1, completed: false, ...item })),
        steps: (recipeData.steps || []).map((item, index) => ({ id: index + 1, completed: false, failureTags: [], ...item })),
        conditions: recipeData.conditions || [],
        attachments: recipeData.attachments || [],
    };
    // FIX: Changed navigation to a page type that is now defined.
    navigate('recipeEditor', { recipeData: finalRecipeData });
  };
  
  const isFinalizeReady = recipeData.title && recipeData.description && recipeData.steps && recipeData.steps.length > 0;

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-8">
            {/* FIX: Used correct translation key. */}
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t.aiCreatorTitle}</h1>
            {/* FIX: Used correct translation key. */}
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">{t.aiCreatorDescription}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Chat Column */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[75vh]">
                <header className="flex items-center gap-3 p-4 border-b bg-gray-50 rounded-t-xl">
                    <BotIcon className="w-6 h-6 text-blue-600"/>
                    {/* FIX: Used correct translation key. */}
                    <h2 className="font-bold text-lg text-gray-800">{t.aiCreatorChatTitle}</h2>
                </header>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-2xl py-2 px-4 max-w-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="rounded-2xl py-2 px-4 bg-gray-100 text-gray-800">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t">
                    <div className="flex items-center bg-gray-100 rounded-full">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            // FIX: Used correct translation key.
                            placeholder={t.aiCreatorChatPlaceholder}
                            className="w-full bg-transparent px-4 py-2 text-gray-700 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || userInput.trim() === ''} className="p-2 text-blue-600 disabled:text-gray-400 m-1 rounded-full hover:bg-blue-100 disabled:hover:bg-transparent">
                            <SendIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Column */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
                {/* FIX: Used correct translation key. */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{t.aiCreatorPreviewTitle}</h2>
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    {recipeData.title && <div className="animate-slide-up">
                        {/* FIX: Used correct translation key. */}
                        <h3 className="font-bold text-gray-500 text-sm">{t.recipeTitleLabel}</h3>
                        <p className="text-xl font-bold text-gray-900">{recipeData.title}</p>
                    </div>}
                    {recipeData.description && <div className="animate-slide-up">
                        {/* FIX: Used correct translation key. */}
                        <h3 className="font-bold text-gray-500 text-sm">{t.recipeDescLabel}</h3>
                        <p className="text-gray-700">{recipeData.description}</p>
                    </div>}
                    {recipeData.category && <div className="animate-slide-up">
                        {/* FIX: Used correct translation key. */}
                        <h3 className="font-bold text-gray-500 text-sm">{t.recipeCatLabel}</h3>
                        <p className="text-gray-700 bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full inline-block">{recipeData.category}</p>
                    </div>}
                    {recipeData.ingredients && recipeData.ingredients.length > 0 && <div className="animate-slide-up">
                        {/* FIX: Used correct translation key. */}
                        <h3 className="font-bold text-gray-500 text-sm">{t.ingredients}</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {recipeData.ingredients.map((ing, i) => <li key={i}>{(ing as ChecklistItem).text || ing as any}</li>)}
                        </ul>
                    </div>}
                    {recipeData.steps && recipeData.steps.length > 0 && <div className="animate-slide-up">
                        {/* FIX: Used correct translation key. */}
                        <h3 className="font-bold text-gray-500 text-sm">{t.steps}</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            {recipeData.steps.map((step, i) => <li key={i} className="text-gray-700"><strong className="text-gray-800">{step.title}</strong>: {step.details}</li>)}
                        </ol>
                    </div>}
                </div>
                <div className="mt-6 border-t pt-4">
                    <button
                        onClick={handleFinalize}
                        disabled={!isFinalizeReady}
                        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                    >
                        {/* FIX: Used correct translation key. */}
                        {t.aiCreatorFinalizeButton}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CreateRecipeAIPage;
