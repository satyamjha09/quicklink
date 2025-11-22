import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

// Initialize the Gemini client
// NOTE: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Asks Gemini for styling advice based on user input.
   */
  getStylingSuggestion: async (prompt: string): Promise<AIResponse> => {
    try {
      const model = "gemini-2.5-flash";
      
      const systemInstruction = `
        You are an expert 3D Scene Designer and UI/UX Specialist.
        Your task is to interpret the user's mood or theme request and generate specific settings for a 3D viewer application.
        
        Return a JSON object with:
        - backgroundColor: A hex color string (e.g. '#ffffff') that matches the theme.
        - wireframe: boolean (true if the style implies technical/blueprint look).
        - gridHelper: boolean (true if the style is architectural or mathematical).
        - explanation: A very short (max 1 sentence) friendly explanation of why you chose this style.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              backgroundColor: { type: Type.STRING },
              wireframe: { type: Type.BOOLEAN },
              gridHelper: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING }
            },
            required: ["backgroundColor", "wireframe", "gridHelper", "explanation"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");

      return JSON.parse(text) as AIResponse;
      
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
