
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
// FIX: Imported newly implemented mock functions to resolve errors.
import { getChatbotResponse, cleanAndParseJson } from '../services/geminiService';
import { ChatIcon, SendIcon, CloseIcon, BotIcon } from './icons';
// FIX: Imported newly defined types to resolve errors.
import { ChatMessage, Recipe, RecommendedRecipe } from '../types';
import { NavigationContext, LanguageContext, useTranslations } from '../App';

interface ChatbotProps {
  recipes: Recipe[];
}

const Chatbot: React.FC<ChatbotProps> = ({ recipes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([
    // FIX: Used correct translation key.
    { sender: 'bot', text: t.chatbotWelcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { navigate } = useContext(NavigationContext);
  const { language } = useContext(LanguageContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const botResponseJson = await getChatbotResponse(currentInput, recipes, language);
      const botResponseData = cleanAndParseJson(botResponseJson);
      
      // FIX: Added recommendations property, which is now part of the ChatMessage type.
      const botMessage: ChatMessage = {
          sender: 'bot',
          text: botResponseData.responseText,
          recommendations: botResponseData.recommendations?.length > 0 ? botResponseData.recommendations : undefined,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to parse bot response:", error);
      // FIX: Used correct translation key.
      const errorMessage: ChatMessage = {
          sender: 'bot',
          text: t.chatError,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
    // FIX: Used correct translation key.
  }, [input, isLoading, recipes, language, t.chatError]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleRecommendationClick = (recommendation: RecommendedRecipe) => {
    // FIX: Changed navigation to a page type that is now defined.
    navigate('recipeDetail', { id: recommendation.id });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50"
        aria-label="チャットボットを開く"
      >
        <ChatIcon className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-slide-up">
          <header className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <BotIcon className="w-6 h-6"/>
              {/* FIX: Used correct translation key. */}
              <h3 className="font-bold text-lg">{t.chatbotTitle}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200" aria-label="チャットを閉じる">
              <CloseIcon className="h-6 w-6" />
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl py-2 px-4 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  {/* FIX: recommendations property is now available on ChatMessage type. */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 border-t border-gray-300/50 pt-3 space-y-2">
                      {msg.recommendations.map(rec => (
                        <button
                          key={rec.id}
                          onClick={() => handleRecommendationClick(rec)}
                          className="w-full text-left text-sm font-bold text-blue-700 bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          {rec.title} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="rounded-2xl py-2 px-4 bg-white text-gray-800 border border-gray-200 rounded-bl-none">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center bg-gray-100 rounded-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                // FIX: Used correct translation key.
                placeholder={t.chatbotPlaceholder}
                className="w-full bg-transparent px-4 py-2 text-gray-700 focus:outline-none"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-2 text-blue-600 disabled:text-gray-400 hover:text-blue-800 disabled:cursor-not-allowed m-1 rounded-full bg-white disabled:bg-gray-100">
                <SendIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
