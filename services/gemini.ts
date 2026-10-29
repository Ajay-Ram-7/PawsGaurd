
import { GoogleGenAI, Type } from "@google/genai";
import { IssueType } from "../types";

const apiKey = process.env.API_KEY || 'dummy_key_to_prevent_startup_crash';
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeReportSeverity = async (description: string, imageUrl?: string) => {
  try {
    const parts: any[] = [
      { text: `Analyze the following street dog issue report. 
      If an image is provided, analyze the physical condition of the dog, wounds, or behavior.
      Provide:
      1. Severity (Low, Medium, High, Urgent)
      2. Priority description
      3. Reasoning for your assessment
      4. Visual Analysis (what you see in the image)
      5. Suggested number of people needed for rescue (e.g. "1-2 experienced handlers")
      6. Suggested equipment (as a list)
      
      Report Description: "${description}"` }
    ];

    if (imageUrl) {
      // In a real app, you would fetch and convert to base64
      // For this demo, if imageUrl is a picsum or external URL, we might need proxy or just text analysis
      // However, the prompt says "if the user upload an picture", implying real data.
      // But for the sake of the demo, I'll structure it like it's taking a part.
      // If the URL starts with data:, it's base64.
      if (imageUrl.startsWith('data:')) {
        const base64Data = imageUrl.split(',')[1];
        const mimeType = imageUrl.split(';')[0].split(':')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      } else {
        // Fallback or external link logic (Gemini doesn't fetch URLs directly this way usually)
        parts[0].text += ` \n Note: A photo was attached but could not be processed directly as binary. Assess based on description mainly but suggest visual checks.`;
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Urgent'] },
            priority: { type: Type.STRING },
            reason: { type: Type.STRING },
            visualAnalysis: { type: Type.STRING },
            peopleRequired: { type: Type.STRING },
            equipmentSuggested: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["severity", "priority", "reason", "peopleRequired", "equipmentSuggested"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return null;
  }
};

export const generateAdoptableProfile = async (dogData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a heartwarming 3-sentence adoption profile description for a street dog with the following details: 
      Name: ${dogData.name}, Breed: ${dogData.breed}, History: ${dogData.treatmentHistory?.[0]?.diagnosis || 'rescued from street'}.`,
    });
    // Accessing .text property directly as per latest SDK guidelines
    return response.text || "A wonderful dog looking for a forever home.";
  } catch (error) {
    return "A wonderful dog looking for a forever home.";
  }
};
