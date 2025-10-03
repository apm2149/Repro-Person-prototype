// FIX: Added missing page types to support navigation from legacy components.
export type Page = 'expertList' | 'chat' | 'myAi' | 'recipeDetail' | 'upgrade' | 'recipeEditor' | 'recipeAICreator' | 'home' | 'history' | 'recipeList';

export interface ChatTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio?: string;
  avatarUrl?: string;
  systemInstruction?: string;
  status?: 'draft' | 'complete';
  creationHistory?: ChatTurn[];
}

// FIX: Added UserInterest and UserProficiency types.
export type UserInterest = 'exams' | 'jobs' | 'love';
export type UserProficiency = 1 | 2 | 3 | 4 | 5;

export interface User {
  name: string;
  avatar?: string;
  myAis?: Expert[];
  // FIX: Added missing optional fields to User type.
  plan?: 'free' | 'premium';
  interest?: UserInterest;
  // FIX: Corrected typo from UserProfICIENCY to UserProficiency.
  proficiency?: UserProficiency;
  earnings?: number;
  chatHistory?: {
    [expertId: string]: {
      expertName: string;
      expertSpecialty: string;
      messages: ChatTurn[];
    };
  };
  myRecipes?: Recipe[];
}

// FIX: Added RecommendedRecipe type for chatbot.
export interface RecommendedRecipe {
  id: string;
  title: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  // FIX: Added optional recommendations field.
  recommendations?: RecommendedRecipe[];
}

// FIX: Added ChecklistItem type.
export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

// FIX: Added StepItem type.
export interface StepItem {
    id: number;
    title: string;
    details: string;
    completed: boolean;
    duration?: string;
    resources?: string;
    pitfall?: string;
    failureTags: string[];
    alternatives?: string;
    condition?: { key: string; value: string };
}

// FIX: Added Review type.
export interface Review {
    id: string;
    recipeId: string;
    authorName: string;
    authorProficiency: UserProficiency;
    rating: number; // 1-5
    title: string;
    comment: string;
    createdAt: string; // ISO string
}

// FIX: Added Recipe type.
export interface Recipe {
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    isPremium: boolean;
    rating: number; // average rating
    status: 'draft' | 'pending' | 'published';
    ingredients: ChecklistItem[];
    steps: StepItem[];
    qna: { question: string; answer: string }[];
    reviews: Review[];
    verificationCount: number;
    reproductions: { userId: string; photoUrl: string }[];
    conditions?: { key: string, name: string, options: string[] }[];
    attachments?: { name: string; url: string }[];
}