import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { extractTextFromFile, validateFile } from "@/lib/services/textExtraction"
import { analyzeResumeWithGemini } from "@/lib/services/atsAnalysis"
import { getCachedATSResult, cacheATSResult, generateCacheKey } from "@/lib/db/cache"

/* ================= API ROUTE HANDLER ================= */

export async function POST(req: NextRequest) {
    try {
        console.log("📨 Received ATS analysis request")

        // Parse form data
        const formData = await req.formData()
        const file = formData.get("resume") as File
        const role = formData.get("targetRole") as string

        console.log("📋 File:", file?.name, "| Size:", file?.size, "bytes")
        console.log("🎯 Target Role:", role)

        /* ================= INPUT VALIDATION ================= */

        if (!file) {
            return NextResponse.json(
                { success: false, error: "Resume file is required" },
                { status: 400 }
            )
        }

        if (!role || role.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Target role is required" },
                { status: 400 }
            )
        }

        // Validate file
        const fileValidation = validateFile(file)
        if (!fileValidation.valid) {
            return NextResponse.json(
                { success: false, error: fileValidation.error },
                { status: 400 }
            )
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.warn("⚠️ GEMINI_API_KEY not configured - will use fallback analysis")
        } else {
            console.log("✅ Gemini API key detected")
        }

        /* ================= TEXT EXTRACTION ================= */

        console.log("🔄 Extracting text from file...")
        const resumeText = await extractTextFromFile(file)

        if (!resumeText || resumeText.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Could not extract text from file. The file may be empty or corrupted.",
                },
                { status: 400 }
            )
        }

        console.log(`✅ Text extracted: ${resumeText.length} characters`)

        /* ================= CACHE CHECK ================= */

        console.log("🔍 Checking cache...")
        const cacheKey = generateCacheKey(resumeText, role)
        const cachedResult = getCachedATSResult(resumeText, role)

        if (cachedResult) {
            console.log("✅ Found cached result - returning immediately")

            const session = await getServerSession()

            return NextResponse.json({
                success: true,
                authenticated: !!session,
                analysis: cachedResult,
                aiPowered: !!process.env.GEMINI_API_KEY,
                cached: true,
                cacheKey,
            })
        }

        console.log("❌ Cache miss - performing new analysis")

        /* ================= AI ANALYSIS ================= */

        console.log("🤖 Analyzing resume with AI (Gemini)...")
        const analysis = await analyzeResumeWithGemini(resumeText, role)

        // Cache the result
        cacheATSResult(resumeText, role, analysis)

        const session = await getServerSession()

        console.log("✅ Analysis complete - returning results")

        return NextResponse.json({
            success: true,
            authenticated: !!session,
            analysis,
            aiPowered: !!process.env.GEMINI_API_KEY,
            cached: false,
            cacheKey,
        })
    } catch (err: any) {
        console.error("❌ ATS analysis error:", err)

        // Handle Gemini Rate Limits (429)
        if (err.status === 429 || err.message?.includes("429")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "The AI is currently busy (Rate Limit reached). Please wait 60 seconds and try again. This is a limit of the free Gemini tier.",
                },
                { status: 429 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: err instanceof Error ? err.message : "ATS analysis failed",
            },
            { status: 500 }
        )
    }
}

/* ================= CACHE STATISTICS ENDPOINT ================= */

import { getCacheStats, clearOldCache } from "@/lib/db/cache"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const action = searchParams.get("action")

        // Get cache stats
        if (action === "cache-stats") {
            const stats = getCacheStats()
            return NextResponse.json({
                success: true,
                data: {
                    totalCached: stats.totalCached,
                    cacheSizeBytes: stats.cacheSize,
                    cacheSizeMB: (stats.cacheSize / 1024 / 1024).toFixed(2),
                    cacheDir: stats.cacheDir,
                },
            })
        }

        // Clear old cache
        if (action === "clear-cache") {
            const days = parseInt(searchParams.get("days") || "30", 10)
            const deletedCount = clearOldCache(days)
            return NextResponse.json({
                success: true,
                message: `Cleared ${deletedCount} old cache entries (older than ${days} days)`,
            })
        }

        return NextResponse.json(
            { success: false, error: "Unknown action" },
            { status: 400 }
        )
    } catch (err) {
        console.error("❌ Cache operation error:", err)
        return NextResponse.json(
            {
                success: false,
                error: err instanceof Error ? err.message : "Cache operation failed",
            },
            { status: 500 }
        )
    }
}
