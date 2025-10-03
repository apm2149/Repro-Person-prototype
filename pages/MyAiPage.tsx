import React, { useState, useEffect, useRef, useContext } from 'react';
import { Expert, ChatMessage, ChatTurn, Recipe, StepItem } from '../types';
import { LanguageContext, useTranslations, UserContext, NavigationContext } from '../App';
import { getMyAiCreationResponseStream, generateRecipeFromHistory } from '../services/geminiService';
import { BotIcon, SendIcon, UserIcon as ProfileUserIcon } from '../components/icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';
import ExpertCard from '../components/RecipeCard';

const MyAiPage: React.FC = () => {
    const t = useTranslations();
    const { user, setUser } = useContext(UserContext);
    const { language } = useContext(LanguageContext);
    const { navigate } = useContext(NavigationContext);
    
    const [editingAi, setEditingAi] = useState<Expert | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isGeneratingRecipe, setIsGeneratingRecipe] = useState<string | null>(null);

    const updateMyAis = (updatedAi: Expert) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const existingAis = prevUser.myAis || [];
            const isNew = !existingAis.some(ai => ai.id === updatedAi.id);
            const newAisList = isNew
                ? [...existingAis, updatedAi]
                : existingAis.map(ai => ai.id === updatedAi.id ? updatedAi : ai);
            return { ...prevUser, myAis: newAisList };
        });
    };

    const sendUserResponseAndGetAiReply = async (userText: string) => {
        if (isLoading || !user || !editingAi) return;

        const userMessage: ChatMessage = { sender: 'user', text: userText };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        
        const historyForApi: ChatTurn[] = currentMessages
            .filter(m => !(m.sender === 'bot' && (m.text === '作成を再開しますね。' || m.text === "Let's resume creating.")))
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

        let aiWithUserMessage: Expert = { ...editingAi, creationHistory: historyForApi };
        
        setInput('');
        setIsLoading(true);

        try {
            const stream = await getMyAiCreationResponseStream(historyForApi, language);
            let botResponseText = '';
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

            for await (const chunk of stream) {
                botResponseText += (chunk.text || '');
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponseText };
                    return newMessages;
                });
            }
            
            const finalHistory: ChatTurn[] = [...historyForApi, { role: 'model', parts: [{ text: botResponseText }] }];
            let finalAiState: Expert = { ...aiWithUserMessage, creationHistory: finalHistory };
            let shouldCloseEditor = false;

            if (botResponseText.includes('```json')) {
                const jsonMatch = botResponseText.match(/```json\n([\s\S]*)\n```/);
                if (jsonMatch && jsonMatch[1]) {
                    try {
                        const parsedJson = JSON.parse(jsonMatch[1]);
                         const updatedAiData: Expert = {
                            ...aiWithUserMessage,
                            name: parsedJson.name || aiWithUserMessage.name,
                            title: parsedJson.title || aiWithUserMessage.title,
                            specialty: parsedJson.specialty || aiWithUserMessage.specialty,
                            bio: parsedJson.bio || aiWithUserMessage.bio,
                            systemInstruction: parsedJson.systemInstruction || aiWithUserMessage.systemInstruction,
                            status: parsedJson.status || aiWithUserMessage.status,
                            creationHistory: finalHistory,
                        };
                        finalAiState = updatedAiData;
                        setEditingAi(updatedAiData);
                        shouldCloseEditor = true;
                    } catch (e) {
                        console.error("Failed to parse AI profile JSON:", e);
                        setMessages(prev => [...prev, { sender: 'bot', text: t.chatError }]);
                    }
                }
            }
            
            updateMyAis(finalAiState);

            if (shouldCloseEditor) {
                closeEditor();
            }

        } catch (error) {
            console.error("Gemini API call failed:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: t.chatError }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRecipe = async (expertId: string) => {
        const expertToConvert = user?.myAis?.find(ai => ai.id === expertId);
        if (!expertToConvert || !expertToConvert.creationHistory) {
            alert(language === 'ja' ? '対話履歴が見つからないため、レシピを作成できません。' : 'Cannot create recipe because conversation history is missing.');
            return;
        }
    
        setIsGeneratingRecipe(expertId);
    
        try {
            const steps = await generateRecipeFromHistory(expertToConvert.creationHistory, language);
            
            const newRecipe: Omit<Recipe, 'rating' | 'qna' | 'reviews' | 'verificationCount' | 'reproductions'> = {
                id: `recipe-from-ai-${expertToConvert.id}`,
                title: language === 'ja' ? `${expertToConvert.specialty}のレシピ` : `Recipe for ${expertToConvert.specialty}`,
                description: expertToConvert.bio || '',
                category: expertToConvert.specialty,
                author: expertToConvert.name,
                isPremium: false,
                status: 'draft',
                ingredients: [], // Initially empty, user can add in editor
                steps: steps,
            };
    
            navigate('recipeEditor', { recipeData: newRecipe });
    
        } catch (error) {
            console.error("Failed to generate recipe:", error);
            alert(language === 'ja' ? 'レシピの生成に失敗しました。' : 'Failed to generate the recipe.');
        } finally {
            setIsGeneratingRecipe(null);
        }
    };


    const handleStartCreation = async (draftAi?: Expert) => {
        if (draftAi) {
            setEditingAi(draftAi);
            const chatHistory = draftAi.creationHistory?.map(turn => ({
                sender: turn.role === 'model' ? 'bot' : 'user',
                text: turn.parts?.[0]?.text || '',
            } as ChatMessage)) || [];
            
            if ((draftAi.status === 'draft' || draftAi.status === 'complete') && draftAi.creationHistory && draftAi.creationHistory.length > 0) {
                 const resumeMessageText = language === 'ja' ? '作成を再開しますね。' : "Let's resume creating.";
                const messagesWithResume = [...chatHistory, { sender: 'bot' as const, text: resumeMessageText }];
                setMessages(messagesWithResume);
                
                const historyForApi: ChatTurn[] = chatHistory.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));
                
                setIsLoading(true);
                try {
                    const stream = await getMyAiCreationResponseStream(historyForApi, language);
                    let botResponseText = '';
                    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

                    for await (const chunk of stream) {
                        botResponseText += (chunk.text || '');
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponseText };
                            return newMessages;
                        });
                    }

                    const finalHistory: ChatTurn[] = [...historyForApi, { role: 'model', parts: [{ text: botResponseText }] }];
                    const updatedAi: Expert = { ...draftAi, creationHistory: finalHistory };
                    setEditingAi(updatedAi);
                    updateMyAis(updatedAi);
                } catch (error) {
                    console.error("Gemini API call failed on draft resume:", error);
                    setMessages(prev => [...prev, { sender: 'bot', text: t.chatError }]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                 setMessages(chatHistory);
            }
        } else {
            const newAiId = `my-ai-${Date.now()}`;
            const initialMessage: ChatMessage = { sender: 'bot', text: t.myAiChatInitialMessage };
            const newAi: Expert = { 
                id: newAiId, 
                name: '', 
                title: '', 
                specialty: '', 
                status: 'draft',
                creationHistory: [{ role: 'model', parts: [{ text: initialMessage.text }] }]
            };
            setMessages([initialMessage]);
            setEditingAi(newAi);
            setUser(prevUser => {
                if (!prevUser) return null;
                const existingAis = prevUser.myAis || [];
                return { ...prevUser, myAis: [...existingAis, newAi] };
            });
        }
    };

    const closeEditor = () => {
        setEditingAi(null);
        setMessages([]);
        setInput('');
    };

    const handleUserCancel = () => {
        if (editingAi) {
            if (!editingAi.name && !editingAi.title && !editingAi.specialty) {
                setUser(prevUser => {
                    if (!prevUser) return null;
                    const updatedAis = (prevUser.myAis || []).filter(ai => ai.id !== editingAi.id);
                    return { ...prevUser, myAis: updatedAis };
                });
            }
        }
        closeEditor();
    };
    
    const handleCardClick = (ai: Expert) => {
        handleStartCreation(ai);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = () => {
        if (input.trim() === '') return;
        sendUserResponseAndGetAiReply(input.trim());
    };

    const handleChoiceSelect = (choice: string) => {
        sendUserResponseAndGetAiReply(choice);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
        }
    };

    const MessageRenderer: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
        const choiceRegex = /\[CHOICE:(.*?)\]/;
        const match = msg.text.match(choiceRegex);
    
        if (msg.sender === 'bot' && match) {
            const textPart = msg.text.replace(choiceRegex, '').trim();
            const choices = match[1].split('|');
            return (
                <div className="prose prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{textPart}</ReactMarkdown>
                    <div className="flex flex-wrap gap-3 mt-4 not-prose">
                        {choices.map(choice => (
                            <button 
                                key={choice} 
                                onClick={() => handleChoiceSelect(choice)}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl text-base transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
    
        return <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>;
    };

    const lastMessage = messages[messages.length - 1];
    const lastMessageHasChoices = lastMessage?.sender === 'bot' && /\[CHOICE:(.*?)\]/.test(lastMessage.text);
    
    if (editingAi) {
        return (
            <div className="flex-grow grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full animate-fade-in">
                <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200 h-[80vh]">
                    <header className="flex items-center justify-between p-4 bg-gray-50 text-gray-800 rounded-t-2xl border-b flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <BotIcon className="w-8 h-8 text-blue-600"/>
                            <h2 className="text-xl font-bold text-gray-800">{t.myAiWip}</h2>
                        </div>
                        <button onClick={handleUserCancel} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                            &times; {t.cancel}
                        </button>
                    </header>

                    <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {msg.sender === 'bot' && <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><BotIcon className="w-6 h-6 text-gray-600"/></div>}
                                <div className={`rounded-2xl py-3 px-5 max-w-lg shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                    {msg.sender === 'user' ? <p className="text-lg">{msg.text}</p> : <MessageRenderer msg={msg} />}
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length-1]?.sender !== 'bot' && (
                           <div className="flex items-end gap-3 flex-row">
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><BotIcon className="w-6 h-6 text-gray-600"/></div>
                                <div className="rounded-2xl py-3 px-5 max-w-lg shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-2xl flex-shrink-0">
                        {lastMessageHasChoices ? (
                             <div className="text-center text-sm text-gray-500 p-3 bg-gray-100 rounded-full">
                                {language === 'ja' ? '上のボタンから選択してください。' : 'Please select an option above.'}
                            </div>
                        ) : (
                            <div className="relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder={t.myAiChatPlaceholder}
                                    className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-16 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <SendIcon className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[80vh]">
                    <header className="p-6 border-b flex-shrink-0">
                         <h2 className="text-2xl font-bold text-gray-800">{t.myAiProfilePreview}</h2>
                    </header>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                        <div className="animate-fade-in">
                            <ExpertCard expert={editingAi} />
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                                <p>対話を進めると、このプレビューがリアルタイムで更新されます。名前、肩書、専門分野などが決まると、ここに表示されます。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t.myAisTitle}</h1>
                    <p className="text-lg text-gray-600 mt-1">{t.myAisSubtitle}</p>
                </div>
                <button 
                    onClick={() => handleStartCreation()}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md flex-shrink-0"
                >
                    {t.myAisCreateNewButton}
                </button>
            </div>
            
            {user?.myAis && user.myAis.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.myAis.map(ai => (
                        <div key={ai.id} onClick={() => handleCardClick(ai)}>
                            <ExpertCard 
                                expert={ai}
                                onCreateRecipe={handleCreateRecipe}
                                isGeneratingRecipe={isGeneratingRecipe === ai.id}
                             />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                    <ProfileUserIcon className="w-24 h-24 text-gray-300 mb-4" />
                    <p className="text-lg text-gray-600">{t.myAisNoBots}</p>
                    <button 
                        onClick={() => handleStartCreation()}
                        className="mt-6 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
                    >
                        {t.myAisCreateFirstButton}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyAiPage;