import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Expert, ChatMessage, ChatTurn } from '../types';
import { LanguageContext, useTranslations, UserContext } from '../App';
import { getExpertResponseStream } from '../services/geminiService';
import { BotIcon, SendIcon, UserIcon, TagIcon } from '../components/icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';


const ChatPage: React.FC<{ expert: Expert }> = ({ expert }) => {
  const t = useTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useContext(LanguageContext);
  const { user, setUser } = useContext(UserContext);
  const isInitialLoad = useRef(true);
  
  const generateInitialMessage = useCallback(async () => {
      setIsLoading(true);
      setMessages([{ sender: 'bot', text: '' }]); // Placeholder for streaming
      try {
          const introPrompt = language === 'ja'
              ? 'あなたのペルソナに基づいて、フレンドリーに自己紹介をしてください。'
              : 'Please give a friendly introduction based on your persona.';

          const history = [{ role: 'user' as const, parts: [{ text: introPrompt }] }];
          
          const stream = await getExpertResponseStream(history, expert);
          let botResponseText = '';

          for await (const chunk of stream) {
              botResponseText += chunk.text;
              setMessages([{ sender: 'bot', text: botResponseText }]);
          }
      } catch (error) {
          console.error("Failed to generate initial message:", error);
          setMessages([{ sender: 'bot', text: t.chatError }]);
      } finally {
          setIsLoading(false);
      }
  }, [expert, language, t.chatError]);

  useEffect(() => {
      if (isInitialLoad.current && user) {
          isInitialLoad.current = false;
          const existingHistory = user.chatHistory?.[expert.id]?.messages;

          if (existingHistory && existingHistory.length > 0) {
              const loadedMessages = existingHistory.map(turn => ({
                  sender: turn.role === 'model' ? 'bot' : 'user',
                  text: turn.parts[0]?.text || '',
              } as ChatMessage));
              setMessages(loadedMessages);
          } else {
              generateInitialMessage();
          }
      }
  }, [expert.id, user, generateInitialMessage]);
  
  useEffect(() => {
    // This function will be called when the component unmounts
    return () => {
        if (user && messages.length > 1) { // more than just the initial bot message
            const historyToSave: ChatTurn[] = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            setUser(prevUser => {
                if (!prevUser) return null;
                const newHistory = {
                    ...prevUser.chatHistory,
                    [expert.id]: {
                        expertName: expert.name,
                        expertSpecialty: expert.specialty,
                        messages: historyToSave
                    }
                };
                return { ...prevUser, chatHistory: newHistory };
            });
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    
    const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = currentMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));
    
    setIsLoading(true);
    setInput('');
    
    try {
        const stream = await getExpertResponseStream(history, expert);
        let botResponseText = '';
        
        setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

        for await (const chunk of stream) {
            botResponseText += chunk.text;
             setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponseText };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'bot') {
                 newMessages[newMessages.length - 1] = { sender: 'bot', text: t.chatError };
            } else {
                 newMessages.push({ sender: 'bot', text: t.chatError });
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in flex-grow">
        <header className="flex items-center justify-between p-4 bg-gray-50 text-gray-800 rounded-t-2xl border-b flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <UserIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{expert.name}</h1>
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                  <TagIcon className="w-3 h-3 mr-1.5" />
                  {expert.specialty}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'bot' && (
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <BotIcon className="w-6 h-6 text-gray-600"/>
                      </div>
                    )}
                    <div className={`rounded-2xl py-3 px-5 max-w-lg shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                        {msg.sender === 'user' ? (
                          <p className="text-lg">{msg.text}</p>
                        ) : (
                          <div className="prose prose-lg max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                          </div>
                        )}
                    </div>
                </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length-1]?.sender !== 'bot' && (
                <div className="flex items-end gap-3 flex-row">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <BotIcon className="w-6 h-6 text-gray-600"/>
                    </div>
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
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={t.chatPlaceholder.replace('{expertName}', expert.name)}
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-16 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    rows={1}
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <SendIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;