import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key exists to prevent immediate crashes in environments without keys set up yet
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Simulates an interaction with the Atlas AI OS.
 * Uses a specific system instruction to maintain the persona.
 */
export const askCodos = async (userPrompt: string): Promise<string> => {
  if (!ai) {
    // Graceful fallback for demo purposes if no API key is present
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I am running in demo mode. To fully activate my neural pathways, please configure the API_KEY environment variable. For now, I acknowledge your request: " + userPrompt);
      }, 1500);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `You are Atlas, a sophisticated, slightly enigmatic, and highly efficient AI Operating System for teams. 
        Your tone is concise, cosmic, and ultra-professional. 
        You are the "Chief of Staff" that runs 24/7. 
        Keep answers short (under 50 words) and helpful. 
        Use metaphors related to constellations, orbits, or synchronization where appropriate.`,
        temperature: 0.7,
      }
    });

    return response.text || "Systems aligning... please retry.";
  } catch (error) {
    console.error("Atlas Connection Error:", error);
    return "Connection to the neural fabric interrupted. Please try again.";
  }
};
