import { GoogleGenAI, Type } from "@google/genai";
import { Category } from '../types';

// IMPORTANT: In a real production app, never expose API keys on the client side.
// This is for demonstration purposes within the constraints of the prompt.
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AIRecord {
  title: string;
  category: string;
  reason: string;
}

export const getMoodRecommendation = async (mood: string): Promise<AIRecord[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found for Gemini");
    return [
      { title: "Calming Breath", category: "Meditation", reason: "AI Key missing - default fallback." },
      { title: "Ocean Waves", category: "Nature", reason: "AI Key missing - default fallback." }
    ];
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      The user is feeling: "${mood}".
      Recommend 3 specific fictional audio sessions for a wellness app called SoulWave.
      Categories must be one of: Sleep, Meditation, Focus, Healing, Nature.
      Return strictly JSON.
    `;

    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              reason: { type: Type.STRING, description: "Short explanation why this fits the mood" }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as AIRecord[];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};