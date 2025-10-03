import React from 'react';

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 64 64" fill="none">
    <path
      d="M56 60C48 64 16 64 8 60V12C8 6.477 12.477 2 18 2h28C51.523 2 56 6.477 56 12V60Z"
      fill="#0F4C5C"
    />
    <path d="M8 57C24 60 40 60 56 57" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 53C24 56 40 56 56 53" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
    <g transform="translate(0 -2)">
      <path
        d="M45.333 32.667a10.667 10.667 0 1 1-1.564-5.633"
        stroke="#5CB85C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45.333 22v6h-6"
        stroke="#5CB85C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.667 38a10.667 10.667 0 1 1 1.564 5.633"
        stroke="#5CB85C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.667 48.667v-6h6"
        stroke="#5CB85C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <g transform="translate(0 -2)">
      <rect x="28" y="32.5" width="8" height="3" fill="#F0AD4E" rx="1.5"/>
      <circle cx="26" cy="34" r="3" fill="#F0AD4E" />
      <circle cx="38" cy="34" r="3" fill="#F0AD4E" />
    </g>
    <circle cx="50" cy="9" r="3" fill="#F0AD4E" />
  </svg>
);

export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
  </svg>
);

export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5a1 1 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.5 14c-.83 0-1.5-.67-1.5-1.5S6.67 11 7.5 11s1.5.67 1.5 1.5S8.33 14 7.5 14zm9 0c-.83 0-1.5-.67-1.5-1.5S15.67 11 16.5 11s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"></path>
    </svg>
);

export const IngredientsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
    </svg>
);

export const StepsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

export const CrownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L10 13.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 8.121a.75.75 0 01.416-1.28l4.21-.611L9.327 2.42A.75.75 0 0110 2zM10 4.269L8.667 7.03l-3.05.44 2.207 2.15-.52 3.038L10 11.23l2.725 1.433-.52-3.038 2.207-2.15-3.05-.44L10 4.27z" />
  </svg>
);

export const BookmarkIcon = (props: React.SVGProps<SVGSVGElement> & { filled?: boolean }) => {
  const { filled = false, ...rest } = props;
  return (
    <svg {...rest} viewBox="0 0 20 20" fill="currentColor">
      {filled ? (
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
      ) : (
        <path fillRule="evenodd" d="M5 2a2 2 0 012-2h6a2 2 0 012 2v16l-5-3.125L5 18V2zm2 1v12.535l3-1.875 3 1.875V3H7z" clipRule="evenodd" />
      )}
    </svg>
  );
};

export const MessageCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const QandAIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
);

export const YenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19v-7L7 5M17 5l-5 7M7 11h10M7 15h10" />
    </svg>
);

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-1.02-.01-1.8-2.58.5-3.14-1.12-3.26-1.42-.12-.3-.6-.94-.74-1.14-.14-.2-.36-.42-.04-.42.32-.02.58.28.66.42.36.62 1.02 1.28 1.88 1.28.86 0 1.54-.28 1.94-.58.1-.46.36-.82.6-1.02-2.22-.24-4.56-1.1-4.56-4.94 0-1.1.38-1.98 1.02-2.68-.1-.26-.44-1.28.1-2.64 0 0 .84-.26 2.74 1.02.8-.22 1.64-.32 2.48-.32.84 0 1.68.1 2.48.32 1.9-1.28 2.74-1.02 2.74-1.02.54 1.36.2 2.38.1 2.64.64.7 1.02 1.58 1.02 2.68 0 3.86-2.34 4.7-4.58 4.94.36.32.68.92.68 1.84 0 1.34-.01 2.42-.01 2.74 0 .26.18.58.68.48A10.015 10.015 0 0 0 22 12c0-5.52-4.48-10-10-10z"></path>
    </svg>
);

export const CheckBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);
  
export const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1.5H5.5A1.5 1.5 0 004 7v8a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0016 15V7a1.5 1.5 0 00-1.5-1.5H12V4a2 2 0 00-2-2zm-2.5 6a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" clipRule="evenodd" />
    </svg>
);

export const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.25 3.03-1.742 3.03H4.42c-1.492 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

export const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a1 1 0 011 1v1.018a7 7 0 015.346 5.345 1 1 0 11-1.98.39A5 5 0 0010 5 1 1 0 019 4V3a1 1 0 011-1zm0 16a1 1 0 01-1-1 7 7 0 01-5.346-5.346 1 1 0 111.98-.39A5 5 0 0010 15a1 1 0 011 1zm-5.346-9.654a1 1 0 010-1.98A7 7 0 019.018 3H8a1 1 0 010-2h4a1 1 0 110 2h-1.018a7 7 0 01-5.345 5.346 1 1 0 01-.39 1.98zm12.674 3.02a1 1 0 11-1.98-.39 5 5 0 00-4.346-4.346 1 1 0 11.39-1.98 7 7 0 014.936 4.936zM10 7a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
);

export const PaperclipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.5 3a2.5 2.5 0 00-2.5 2.5v9A2.5 2.5 0 005.5 17h9a2.5 2.5 0 002.5-2.5v-6.5a.75.75 0 00-1.5 0v6.5a1 1 0 01-1 1h-9a1 1 0 01-1-1v-9a1 1 0 011-1h7.5a.75.75 0 000-1.5H5.5zM15 2.5a.75.75 0 000 1.5h1.086l-4.72 4.72a.75.75 0 101.06 1.06l4.72-4.72V6.25a.75.75 0 001.5 0V2.75a.25.25 0 00-.25-.25H15z" clipRule="evenodd" />
    </svg>
);

// FIX: Add missing BookOpenIcon and HeartIcon.
export const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5.252A2 2 0 0111 4.748V16a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        <path d="M13.252 4A2 2 0 0115 2h1a2 2 0 012 2v12a2 2 0 01-2 2h-1a2 2 0 01-1.748-1.252V4z" />
    </svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

export const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-.707-.707A2 2 0 0012.414 4H7.586a2 2 0 00-1.293.293L5.586 5H4zm6 8a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

export const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M15.5 3.5A2.5 2.5 0 0013 1h-6a2.5 2.5 0 00-2.5 2.5V6h-2v2.5A2.5 2.5 0 004.5 11H5v2.5A2.5 2.5 0 007.5 16h5a2.5 2.5 0 002.5-2.5V11h.5a2.5 2.5 0 002.5-2.5V6h-2V3.5zM12.5 6H12v5.5A1.5 1.5 0 0110.5 13h-1A1.5 1.5 0 018 11.5V6H7.5V3.5a1 1 0 011-1h3a1 1 0 011 1V6z" />
    </svg>
);

export const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);