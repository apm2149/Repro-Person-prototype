import React from 'react';

// FIX: Add body and buttonText to props to support internationalization and fix a type error where this component was called with props that were not defined.
interface CompletionCelebrationProps {
  message: string;
  body: string;
  buttonText: string;
  onClose: () => void;
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({ message, body, buttonText, onClose }) => {
    const confetti = Array.from({ length: 50 }).map((_, i) => {
        const colors = ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400'];
        const style = {
            left: `${Math.random() * 100}%`,
            top: `${-20 - Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
            className: colors[Math.floor(Math.random() * colors.length)],
        };
        return <div key={i} className={`absolute w-2 h-4 ${style.className}`} style={{left: style.left, top: style.top, transform: style.transform, animation: style.animation}}></div>;
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center relative overflow-hidden transform transition-all animate-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none">
            {confetti}
        </div>
        <h2 className="text-3xl font-extrabold text-blue-600 mb-4 z-10 relative">{message}</h2>
        {/* FIX: Use body and buttonText props for internationalization. The previous version had hardcoded Japanese text. */}
        <p className="text-lg text-gray-700 z-10 relative">{body}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors z-10 relative"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CompletionCelebration;
