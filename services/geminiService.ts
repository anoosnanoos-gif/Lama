
import { GoogleGenAI, Type } from "@google/genai";
import { FALLBACK_QUESTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyQuestion = async (lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single, very short, deep, and reflective daily journaling question. 
      Language: ${lang === 'ar' ? 'Arabic' : 'English'}. 
      Tone: Soulful, minimalist, and poetic. 
      The goal is a "one line" answer. 
      Avoid cliché questions. 
      Output ONLY the question text.`,
      config: {
        temperature: 0.85,
        topP: 0.9,
      }
    });

    return response.text?.trim() || FALLBACK_QUESTIONS[lang][Math.floor(Math.random() * FALLBACK_QUESTIONS[lang].length)];
  } catch (error) {
    console.error("Error generating question:", error);
    return FALLBACK_QUESTIONS[lang][Math.floor(Math.random() * FALLBACK_QUESTIONS[lang].length)];
  }
};

export const generateWeeklyInsight = async (entries: string[]): Promise<string> => {
  if (entries.length === 0) return "Start journaling to discover your weekly pattern.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `These are 7 journal entries from a user's week (one line each):
      ${entries.join('\n')}
      
      Based on these lines, provide a short, compassionate, and poetic reflection about their week. 
      Language: English.
      Limit to 2-3 short sentences. 
      Tone: Warm, minimalist, Zen-like.`,
    });

    return response.text?.trim() || "A week full of small details that make up your big story.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "A week of quiet, meaningful moments.";
  }
};
