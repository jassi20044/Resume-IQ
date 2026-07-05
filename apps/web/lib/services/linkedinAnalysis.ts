import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.LINKEDIN_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "")

export interface LinkedInAnalysisResult {
    score: number
    overallAnalysis: string
    sections: {
        headline: { score: number; feedback: string[] }
        about: { score: number; feedback: string[] }
        experience: { score: number; feedback: string[] }
        skills: { score: number; feedback: string[] }
    }
    suggestions: {
        priority: "high" | "medium" | "low"
        issue: string
        suggestion: string
    }[]
}

/**
 * Analyze LinkedIn profile data using Groq AI
 */
export async function analyzeLinkedInProfile(
    profileData: string,
    targetRole: string
): Promise<LinkedInAnalysisResult> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not set");
    }

    try {
        console.log(`🚀 Using Groq for LinkedIn Analysis: ${targetRole}`)
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a LinkedIn Profile Optimization Expert. You analyze profiles against target roles."
                    },
                    {
                        role: "user",
                        content: `Analyze this LinkedIn profile for the role of "${targetRole}":
                        
PROFILE DATA:
${profileData}

Provide a detailed analysis in JSON format:
{
  "score": <0-100>,
  "overallAnalysis": "<paragraphs>",
  "sections": {
    "headline": { "score": <0-100>, "feedback": ["<point>"] },
    "about": { "score": <0-100>, "feedback": ["<point>"] },
    "experience": { "score": <0-100>, "feedback": ["<point>"] },
    "skills": { "score": <0-100>, "feedback": ["<point>"] }
  },
  "suggestions": [
    { "priority": "high|medium|low", "issue": "<description>", "suggestion": "<recommendation>" }
  ]
}`
                    }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API Error: ${errorData.error?.message}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error("Parse Error:", content);
            throw new Error("Failed to parse AI analysis");
        }
    } catch (error) {
        console.error("LinkedIn Analysis Error:", error)
        throw error
    }
}
