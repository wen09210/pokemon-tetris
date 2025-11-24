import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getEncouragement = async (linesCleared: number, combo: number): Promise<string> => {
  if (!genAI) return "Sweet!";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a game announcer for a Candy-themed puzzle game (like Candy Crush).
      The player just cleared ${linesCleared} lines at once${combo > 1 ? ` with a ${combo}x combo` : ''}!
      Generate a single, very short (max 3 words), enthusiastic, candy-themed exclamation.
      Examples: "Sugar Crush!", "Tasty!", "Delicious!", "Sweet Victory!", "Divine!", "Berry Blast!".
      Do not use quotes.
    `;

    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Low latency needed
        maxOutputTokens: 10,
        temperature: 1.2, // High creativity for variety
      }
    });

    return response.text?.trim() || "Delicious!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tasty!";
  }
};
