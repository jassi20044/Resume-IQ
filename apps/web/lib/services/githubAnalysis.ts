import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GITHUB_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "")

export interface GitHubAnalysisResult {
    score: number
    overallAnalysis: string
    sections: {
        repositories: { score: number; feedback: string[] }
        activity: { score: number; feedback: string[] }
        skills: { score: number; feedback: string[] }
        documentation: { score: number; feedback: string[] }
    }
    suggestions: {
        priority: "high" | "medium" | "low"
        issue: string
        suggestion: string
    }[]
}

/**
 * Fetch public GitHub data for a user
 */
async function fetchGitHubData(username: string) {
    try {
        // Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) throw new Error("GitHub user not found")
        const userData = await userRes.json()

        // Fetch repositories
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
        const reposData = await reposRes.json()

        // Simplify data for AI
        const simplifiedRepos = reposData.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated_at: repo.updated_at
        }))

        return {
            profile: {
                login: userData.login,
                bio: userData.bio,
                public_repos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
                created_at: userData.created_at
            },
            repositories: simplifiedRepos
        }
    } catch (error) {
        console.error("Error fetching GitHub data:", error)
        throw error
    }
}

/**
 * Analyze GitHub data using Groq AI
 */
export async function analyzeGitHubProfile(
    username: string,
    targetRole: string
): Promise<GitHubAnalysisResult> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is missing");
    }

    try {
        const githubData = await fetchGitHubData(username)
        console.log(`🚀 Using Groq for GitHub Analysis: ${username}`)
        
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
                        content: "You are a Technical Recruiter and Senior Engineer. You analyze GitHub profiles for role alignment."
                    },
                    {
                        role: "user",
                        content: `Analyze this GitHub profile for a candidate targeting the role of "${targetRole}":
                        
GITHUB DATA:
${JSON.stringify(githubData, null, 2)}

Provide a detailed analysis in JSON format:
{
  "score": <0-100>,
  "overallAnalysis": "<paragraphs>",
  "sections": {
    "repositories": { "score": <0-100>, "feedback": ["<point>"] },
    "activity": { "score": <0-100>, "feedback": ["<point>"] },
    "skills": { "score": <0-100>, "feedback": ["<point>"] },
    "documentation": { "score": <0-100>, "feedback": ["<point>"] }
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
            throw new Error("Failed to parse GitHub analysis");
        }
    } catch (error) {
        console.error("GitHub Analysis Error:", error)
        throw error
    }
}
