import { GoogleGenerativeAI } from "@google/generative-ai"
// Last Updated: 2026-04-29T12:24:00

/**
 * Analyzes resume against target role using Gemini AI
 */

const genAI = new GoogleGenerativeAI(process.env.ATS_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "")

interface ATSBreakdown {
    formatting: {
        score: number
        feedback: string[]
    }
    keywords: {
        score: number
        matchedKeywords: string[]
        missingKeywords: string[]
        feedback: string[]
    }
    structure: {
        score: number
        feedback: string[]
    }
    content: {
        score: number
        feedback: string[]
    }
}

interface ATSSuggestion {
    category: "Keywords" | "Formatting" | "Content" | "Structure"
    priority: "high" | "medium" | "low"
    issue: string
    suggestion: string
    example: string
    impact: string
}

export interface ATSAnalysisResult {
    score: number
    overallAnalysis: string
    breakdown: ATSBreakdown
    suggestions: ATSSuggestion[]
    strengths: string[]
    weaknesses: string[]
}

/**
 * Analyze resume using Groq AI (Llama 3)
 */
export async function analyzeResumeWithGemini(
    resumeText: string,
    targetRole: string
): Promise<ATSAnalysisResult> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    try {
        console.log("🚀 Using Groq for ATS analysis")
        
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
                        content: "You are a strict ATS (Applicant Tracking System) analyzer. You must be critical and realistic in your scoring. Most resumes score between 45-75. Only exceptional resumes score 85+."
                    },
                    {
                        role: "user",
                        content: `Analyze the following resume for the role: "${targetRole}".
                        
RESUME TEXT:
${resumeText}

CRITICAL INSTRUCTIONS:
- You MUST return ONLY valid JSON.
- Be extremely detailed. For each section, provide 5-8 points.
- Provide 6-10 Actionable suggestions with examples.

JSON STRUCTURE:
{
  "score": <number>,
  "overallAnalysis": "<paragraphs>",
  "breakdown": {
    "formatting": { "score": <number>, "feedback": ["<point>"] },
    "keywords": { "score": <number>, "matchedKeywords": [], "missingKeywords": [], "feedback": ["<point>"] },
    "structure": { "score": <number>, "feedback": ["<point>"] },
    "content": { "score": <number>, "feedback": ["<point>"] }
  },
  "suggestions": [
    { "category": "Keywords", "priority": "high", "issue": "<description>", "suggestion": "<recommendation>", "example": "<text>", "impact": "<text>" }
  ],
  "strengths": ["<point>"],
  "weaknesses": ["<point>"]
}`
                    }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            const analysis = JSON.parse(content);
            console.log("✅ ATS ANALYSIS COMPLETE | Score:", analysis.score);
            return analysis;
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Content:", content);
            throw new Error("Failed to parse the AI analysis result.");
        }
    } catch (error) {
        console.error("ATS Analysis Service Error:", error)
        throw error
    }
}
