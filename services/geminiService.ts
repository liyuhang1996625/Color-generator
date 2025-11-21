import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GradientConfig } from "../types";

const gradientSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    gradientName: { type: Type.STRING, description: "A creative name for the gradient" },
    description: { type: Type.STRING, description: "Short explanation of the color choices" },
    type: { type: Type.STRING, enum: ["linear", "radial"] },
    angle: { type: Type.INTEGER, description: "Angle in degrees (0-360) if linear, default 90" },
    animation: { type: Type.STRING, enum: ["none", "rotate", "pulse"], description: "Suggested animation style" },
    animationDuration: { type: Type.NUMBER, description: "Suggested animation duration in seconds (3-20)" },
    stops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          color: { type: Type.STRING, description: "Hex color code e.g., #FF0000" },
          offset: { type: Type.INTEGER, description: "Position 0-100" }
        },
        required: ["color", "offset"]
      }
    }
  },
  required: ["gradientName", "type", "stops", "angle"]
};

export const generateGradientFromMood = async (prompt: string): Promise<{ config: GradientConfig, name: string, description: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a beautiful CSS/SVG gradient based on this description: "${prompt}". 
      Ensure colors are harmonious and accessible. 
      If the user mentions a specific style (cyberpunk, pastel, nature), match it strictly.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: gradientSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple tasks
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    
    // Map to internal structure (adding IDs)
    const config: GradientConfig = {
      type: data.type as 'linear' | 'radial',
      angle: data.angle || 90,
      animation: data.animation || 'none',
      animationDuration: data.animationDuration || 10,
      stops: data.stops.map((s: any) => ({
        id: crypto.randomUUID(),
        color: s.color,
        offset: s.offset
      }))
    };

    return {
      config,
      name: data.gradientName,
      description: data.description
    };

  } catch (error) {
    console.error("AI Generation failed:", error);
    throw error;
  }
};