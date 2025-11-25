import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

// Initialize Gemini
// Note: In a real production app, ensure your env var is set.
// For this demo, we assume the environment has the key.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDrinkFortune = async (drink: MenuItem): Promise<string> => {
  if (!apiKey) {
    return "命運之神說：這杯飲料將帶給你無盡的好運！(請設定 API Key 以獲得更多指引)";
  }

  try {
    const prompt = `
      User just spun a wheel to decide what bubble tea to drink at the store "King Charlie" (查理國王).
      The result is: ${drink.name} (Category: ${drink.category}).
      
      Please write a short, fun, and slightly mystical "fortune cookie" style message (in Traditional Chinese, Taiwan style) about why this specific drink is their destiny today. 
      Keep it under 50 words. Be enthusiastic!
      Mention "國王" (King) or "查理" (Charlie) or "命定" in a fun way if it fits.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || `查理國王為你選擇了 ${drink.name}，享受吧！`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `命運之神神秘地微笑了。就是這杯 ${drink.name}！`;
  }
};