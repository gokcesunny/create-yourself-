import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, GeneratedRole, Blueprint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for generating roles
const roleSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      tagline: { type: Type.STRING },
      description: { type: Type.STRING },
      salaryRange: { type: Type.STRING },
      demandScore: { type: Type.INTEGER },
      skillsMatch: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      innovativeFactor: { type: Type.STRING, description: "Why is this a unique or future-proof role?" },
    },
    required: ["id", "title", "tagline", "description", "salaryRange", "demandScore", "skillsMatch", "innovativeFactor"],
  },
};

export const generateCareerPaths = async (profile: UserProfile): Promise<GeneratedRole[]> => {
  const prompt = `
    Based on the following user profile, act as a visionary Career Architect and invent or identify 4 distinct job roles.
    
    1. A "Safe Bet" (Existing role that fits perfectly).
    2. A "Reach" (Ambitious, high-level role).
    3. A "Pivot" (Different industry but using same skills).
    4. A "Wildcard" (A completely new job title created just for them, entrepreneurial or futuristic).

    User Profile:
    - Core Skills: ${profile.skills}
    - Interests/Passions: ${profile.interests}
    - Work Values: ${profile.values}
    - Preferred Industry: ${profile.industryPreference}
    - Wildcard/Dreams: ${profile.wildcard}

    Output valid JSON strictly adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roleSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as GeneratedRole[];
  } catch (error) {
    console.error("Error generating roles:", error);
    throw error;
  }
};

export const blendRoles = async (role1: GeneratedRole, role2: GeneratedRole, profile: UserProfile): Promise<GeneratedRole> => {
  const prompt = `
    Act as an expert Career Architect. The user wants to combine two specific career paths into one hybrid, high-value role.
    
    Role 1: ${role1.title} - ${role1.description}
    Role 2: ${role2.title} - ${role2.description}
    
    User Context:
    - Skills: ${profile.skills}
    - Interests: ${profile.interests}

    Create a NEW unique job role that blends the best aspects of both.
    - Title: Creative hybrid title.
    - Description: How these two worlds merge.
    - Innovative Factor: Why this combination creates a unique market advantage.
    
    Output valid JSON strictly adhering to the schema. Return an ARRAY containing just this ONE object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roleSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    const roles = JSON.parse(text) as GeneratedRole[];
    return roles[0];
  } catch (error) {
    console.error("Error blending roles:", error);
    throw error;
  }
};

export const generateRoleBlueprint = async (role: GeneratedRole, profile: UserProfile): Promise<string> => {
  const prompt = `
    The user has selected the role: "${role.title}".
    Role Description: ${role.description}
    Role Innovation: ${role.innovativeFactor}

    User Context:
    - Skills: ${profile.skills}
    - Values: ${profile.values}

    Generate a comprehensive "Career Blueprint" in Markdown format. 
    It should act as a strategic document to help them create this job for themselves or land it.
    
    Include these sections (use H2 headers):
    1. **The Pitch**: A 30-second elevator pitch defining who they are in this role.
    2. **Gap Analysis**: What skills do they need to acquire vs. what they have.
    3. **Custom Learning Curriculum**: 
       - List specific SUBJECTS they must master (e.g., "Behavioral Economics", "Threejs", "Crisis Leadership").
       - Provide a structured PROGRAM (e.g., Month 1-2: Foundation, Month 3-4: Application).
    4. **Action Plan**: Immediate next 3 steps (0-3 months) and long term goals (6-12 months).
    5. **Target Market**: Types of companies to pitch to, or if entrepreneurial, who the customers are.
    6. **Day in the Life**: A creative narrative of what a day looks like in this role.

    Keep it inspiring, actionable, and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Could not generate blueprint.";
  } catch (error) {
    console.error("Error generating blueprint:", error);
    throw error;
  }
};

export const chatWithCareerCoach = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are an expert Career Coach and Business Strategist. Help the user refine their job concept, answer doubts, and provide motivation. Keep answers concise and actionable.",
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};