import React, { useContext } from 'react';
import { UserContext, NavigationContext, useTranslations } from '../App';
import { ChatIcon, TagIcon, UserIcon } from '../components/icons';
import { ChatTurn } from '../types';

const HistoryPage: React.FC = () => {
    const { user } = useContext(UserContext);
    const { navigate } = useContext(NavigationContext);
    const t = useTranslations();
    
    const historyEntries = user?.chatHistory ? Object.entries(user.chatHistory) : [];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t.historyTitle}</h1>
                <p className="text-lg text-gray-600 mt-2">{t.historySubtitle}</p>
            </div>

            {historyEntries.length > 0 ? (
                <div className="space-y-4">
                    {historyEntries.map(([expertId, chatDataObject]) => {
                        // FIX: Cast chatData from 'unknown' to its correct type to resolve property access errors.
                        // `Object.entries` on an object with an index signature can result in values of type `unknown` with strict compiler settings.
                        const chatData = chatDataObject as {
                            expertName: string;
                            expertSpecialty: string;
                            messages: ChatTurn[];
                        };
                        return (
                            <div 
                                key={expertId} 
                                onClick={() => navigate('chat', { id: expertId })}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                                        <UserIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900">{chatData.expertName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                             <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                <TagIcon className="w-3 h-3 mr-1.5" />
                                                {chatData.expertSpecialty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-1">
                                            {chatData.messages.length > 0
                                                ? `${chatData.messages.slice(-1)[0].role === 'user' ? 'You: ' : ''}${chatData.messages.slice(-1)[0].parts[0].text}`
                                                : 'No messages yet.'}
                                        </p>
                                    </div>
                                    <div className="text-blue-500 self-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <ChatIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">{t.noHistory}</p>
                    <p className="text-gray-500 mt-1">Start a conversation with a recipe AI to see it here.</p>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
