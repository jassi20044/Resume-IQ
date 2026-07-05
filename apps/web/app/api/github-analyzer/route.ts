import { NextRequest, NextResponse } from "next/server"
import { analyzeGitHubProfile } from "@/lib/services/githubAnalysis"

export async function POST(req: NextRequest) {
    try {
        const { githubUrl, targetRole } = await req.json()

        if (!targetRole || targetRole.trim() === "") {
            return NextResponse.json({ success: false, error: "Please enter a target job role." }, { status: 400 })
        }

        if (!githubUrl || githubUrl.trim() === "") {
            return NextResponse.json({ success: false, error: "GitHub URL is required." }, { status: 400 })
        }

        // Extract username from URL
        // Patterns: github.com/username or https://github.com/username
        const usernameMatch = githubUrl.match(/github\.com\/([^/]+)/)
        const username = usernameMatch ? usernameMatch[1].replace(/\/$/, "") : githubUrl.split("/").pop()

        if (!username) {
            return NextResponse.json({ success: false, error: "Could not extract GitHub username from the URL." }, { status: 400 })
        }

        const analysis = await analyzeGitHubProfile(username, targetRole)

        return NextResponse.json({
            success: true,
            analysis
        })

    } catch (error: any) {
        console.error("GitHub API Error:", error)
        
        if (error.status === 429 || error.message?.includes("429")) {
            return NextResponse.json({ 
                success: false, 
                error: "The AI is currently busy (Rate Limit reached). Please wait 60 seconds." 
            }, { status: 429 })
        }

        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to analyze GitHub profile" 
        }, { status: 500 })
    }
}
