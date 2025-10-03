
import { GoogleGenAI } from "@google/genai";
import { Expert, Recipe, ChatMessage as AIChatMessage, ChatTurn, StepItem } from '../types';
import { MY_AI_CREATION_ASSISTANT_INSTRUCTION_JA, MY_AI_CREATION_ASSISTANT_INSTRUCTION_EN, RECIPE_GENERATION_FROM_HISTORY_INSTRUCTION_JA, RECIPE_GENERATION_FROM_HISTORY_INSTRUCTION_EN } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not defined. Using a placeholder. This will not work for actual API calls.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "API_KEY_NOT_SET" });

export const getExpertResponseStream = (
  conversationHistory: { role: 'user' | 'model', parts: {text: string}[] }[],
  expert: Expert
) => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: conversationHistory,
    config: {
      systemInstruction: expert.systemInstruction,
      temperature: 0.7,
      topP: 0.95,
    },
  });
};

export const getMyAiCreationResponseStream = (
  conversationHistory: { role: 'user' | 'model', parts: {text: string}[] }[],
  language: 'ja' | 'en'
) => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  const instruction = language === 'ja' 
    ? MY_AI_CREATION_ASSISTANT_INSTRUCTION_JA 
    : MY_AI_CREATION_ASSISTANT_INSTRUCTION_EN;

  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: conversationHistory,
    config: {
      systemInstruction: instruction,
      temperature: 0.7,
      topP: 0.95,
    },
  });
};

export const generateRecipeFromHistory = async (
  creationHistory: ChatTurn[],
  language: 'ja' | 'en'
): Promise<StepItem[]> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  const instruction = language === 'ja'
    ? RECIPE_GENERATION_FROM_HISTORY_INSTRUCTION_JA
    : RECIPE_GENERATION_FROM_HISTORY_INSTRUCTION_EN;
  
  // The first message from the assistant is the initial prompt, which isn't part of the user's story.
  const userStoryHistory = creationHistory.slice(1);
  // The last message is the AI's confirmation and JSON output. We don't need that for story analysis.
  const historyForAnalysis = userStoryHistory.slice(0, -1);

  if (historyForAnalysis.length === 0) {
    return [];
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: historyForAnalysis,
    config: {
      systemInstruction: instruction,
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const jsonString = response.text.replace(/```json\n?|\n?```/g, '').trim();
  try {
    const parsedJson = JSON.parse(jsonString);
    // Ensure the generated steps have the completed property
    return (parsedJson as StepItem[]).map(step => ({...step, completed: false}));
  } catch (e) {
    console.error("Failed to parse recipe steps JSON:", e, jsonString);
    throw new Error("Failed to generate valid recipe steps.");
  }
};

// FIX: Added mock implementation for missing function to resolve compile errors.
export const getChatbotResponse = async (
  message: string,
  recipes: Recipe[],
  language: 'ja' | 'en'
): Promise<string> => {
  console.log('getChatbotResponse called with:', { message, recipes, language });
  const response = {
    responseText: language === 'ja' ? `「${message}」についてですね。いくつかおすすめがあります。` : `Regarding "${message}", I have a few recommendations.`,
    recommendations: recipes.slice(0, 2).map(r => ({ id: r.id, title: r.title })),
  };
  return JSON.stringify(response);
};

// FIX: Added mock implementation for missing function to resolve compile errors.
export const cleanAndParseJson = (jsonString: string): any => {
  try {
    const cleaned = jsonString.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON:", jsonString, e);
    return null;
  }
};

// FIX: Added mock implementation for missing function to resolve compile errors.
export const getAIRecipeAssistance = async (
  chatHistory: AIChatMessage[],
  currentRecipe: Partial<Recipe>,
  language: 'ja' | 'en'
): Promise<string> => {
  console.log('getAIRecipeAssistance called with:', { chatHistory, currentRecipe, language });
  const lastUserMessage = chatHistory[chatHistory.length - 1]?.text || '';
  const response = {
    updatedRecipe: {
      ...currentRecipe,
      title: currentRecipe.title || (language === 'ja' ? 'AI生成レシピ' : 'AI-Generated Recipe'),
      description: currentRecipe.description || lastUserMessage,
      steps: currentRecipe.steps || [{ title: 'Step 1', details: 'Do something.' }],
    },
    nextBotMessage: language === 'ja' ? 'レシピを更新しました。他に何かありますか？' : 'I have updated the recipe. Anything else?',
  };
  return JSON.stringify(response);
};
