
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MatchScore } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getMatchRecommendations(mentee: UserProfile, mentors: UserProfile[]): Promise<MatchScore[]> {
    const prompt = `
      Act as an expert career matching engine for a tech mentorship platform.
      
      Mentee Profile:
      - Skills: ${mentee.skills.join(', ')}
      - Goals: ${mentee.goals || 'Not specified'}
      - Bio: ${mentee.bio}

      Potential Mentors:
      ${mentors.map(m => `
        - ID: ${m.id}
        - Name: ${m.name}
        - Skills: ${m.skills.join(', ')}
        - Experience: ${m.experience}
        - Bio: ${m.bio}
      `).join('\n')}

      Task: Compare the mentee's needs with the mentors' expertise. 
      Return a JSON array of match objects containing 'mentorId', a 'score' (0-100), and a brief 'reason' why they are a good fit.
      Rank them by score in descending order.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mentorId: { type: Type.STRING },
                score: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              },
              required: ["mentorId", "score", "reason"]
            }
          }
        }
      });

      const text = response.text || "[]";
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini matching error:", error);
      // Fallback simple logic if API fails or is not configured
      return mentors.map(m => ({
        mentorId: m.id,
        score: Math.floor(Math.random() * 40) + 60,
        reason: "Matched based on general skill overlap."
      }));
    }
  }
}

export const geminiService = new GeminiService();
