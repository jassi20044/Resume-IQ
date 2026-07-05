import { NextRequest, NextResponse } from "next/server"
import { analyzeLinkedInProfile } from "@/lib/services/linkedinAnalysis"

export async function POST(req: NextRequest) {
    try {
        const { linkedinUrl, targetRole, profileText } = await req.json()

        if (!targetRole || targetRole.trim() === "") {
            return NextResponse.json({ success: false, error: "Please enter a target job role first." }, { status: 400 })
        }

        // Handle profile data extraction
        let dataToAnalyze = profileText

        if (!profileText && linkedinUrl) {
            // User provided only a URL
            return NextResponse.json({ 
                success: false, 
                error: "LinkedIn's security blocks direct scraping from this server. Please copy-paste your profile text into the box below for an instant AI analysis." 
            }, { status: 400 })
        }

        if (!dataToAnalyze || dataToAnalyze.trim().length < 50) {
            return NextResponse.json({ 
                success: false, 
                error: "The profile content is too short. Please paste more details (About, Experience, Skills) for a better analysis." 
            }, { status: 400 })
        }

        const analysis = await analyzeLinkedInProfile(dataToAnalyze, targetRole)

        return NextResponse.json({
            success: true,
            analysis
        })

    } catch (error: any) {
        console.error("LinkedIn API Error:", error)
        
        // Handle Gemini Rate Limits (429)
        if (error.status === 429 || error.message?.includes("429")) {
            return NextResponse.json({ 
                success: false, 
                error: "The AI is currently busy (Rate Limit reached). Please wait 60 seconds and try again. This is a limit of the free Gemini tier." 
            }, { status: 429 })
        }

        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to analyze LinkedIn profile" 
        }, { status: 500 })
    }
}
