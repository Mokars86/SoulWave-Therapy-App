import { GoogleGenAI, Type } from "@google/genai";
import { Category } from '../types';

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

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `The user is feeling: "${mood}".
            Recommend 3 specific fictional audio sessions for a wellness app called SoulWave.
            Categories must be one of: Sleep, Meditation, Focus, Healing, Nature, Quran.
            Provide the output as a JSON object with a 'recommendations' array.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "Short explanation why this fits the mood" }
                },
                required: ["title", "category", "reason"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse JSON response:", text);
      return [];
    }

    if (data && Array.isArray(data.recommendations)) {
      return data.recommendations as AIRecord[];
    }
    
    // Fallback if the model returned a root array despite instructions
    if (Array.isArray(data)) {
      return data as AIRecord[];
    }

    return [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return empty array on error so the UI doesn't crash
    return [];
  }
};