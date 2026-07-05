import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"

/**
 * Simple file-based cache for ATS scores
 * Stores results in .ats-cache directory to avoid recalculating
 */

const CACHE_DIR = path.join(process.cwd(), ".ats-cache")

// Ensure cache directory exists
function ensureCacheDir() {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true })
    }
}

/**
 * Generate a unique hash for a resume + role combination
 * This ensures the same resume + role always produces the same cache key
 */
export function generateCacheKey(resumeText: string, targetRole: string): string {
    const combined = `${resumeText.trim()}::${targetRole.trim().toLowerCase()}`
    return crypto.createHash("sha256").update(combined).digest("hex")
}

/**
 * Store ATS analysis result in cache
 */
export function cacheATSResult(
    resumeText: string,
    targetRole: string,
    analysis: any
): string {
    try {
        ensureCacheDir()

        const cacheKey = generateCacheKey(resumeText, targetRole)
        const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`)

        const cacheData = {
            cacheKey,
            targetRole,
            analysisDate: new Date().toISOString(),
            analysis,
            resumeTextHash: crypto.createHash("sha256").update(resumeText).digest("hex"),
            resumeLength: resumeText.length,
        }

        fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2), "utf-8")
        console.log(`✅ Cached ATS result: ${cacheKey}`)

        return cacheKey
    } catch (error) {
        console.warn("⚠️ Failed to cache ATS result:", error)
        return ""
    }
}

/**
 * Retrieve cached ATS result if it exists
 */
export function getCachedATSResult(
    resumeText: string,
    targetRole: string
): any | null {
    try {
        ensureCacheDir()

        const cacheKey = generateCacheKey(resumeText, targetRole)
        const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`)

        if (!fs.existsSync(cacheFile)) {
            return null
        }

        const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf-8"))

        console.log(`✅ Found cached ATS result: ${cacheKey}`)
        console.log(`📅 Cached on: ${cacheData.analysisDate}`)

        return {
            ...cacheData.analysis,
            isCached: true,
            cacheDate: cacheData.analysisDate,
        }
    } catch (error) {
        console.warn("⚠️ Failed to retrieve cached result:", error)
        return null
    }
}

/**
 * Clear old cache entries (older than X days)
 */
export function clearOldCache(daysOld: number = 30): number {
    try {
        ensureCacheDir()

        const files = fs.readdirSync(CACHE_DIR)
        const now = Date.now()
        const maxAge = daysOld * 24 * 60 * 60 * 1000
        let deletedCount = 0

        files.forEach((file) => {
            const filePath = path.join(CACHE_DIR, file)
            const stats = fs.statSync(filePath)
            const fileAge = now - stats.mtimeMs

            if (fileAge > maxAge) {
                fs.unlinkSync(filePath)
                deletedCount++
            }
        })

        console.log(`🗑️ Cleared ${deletedCount} old cache entries`)
        return deletedCount
    } catch (error) {
        console.warn("⚠️ Failed to clear old cache:", error)
        return 0
    }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
    totalCached: number
    cacheSize: number
    cacheDir: string
} {
    try {
        ensureCacheDir()

        const files = fs.readdirSync(CACHE_DIR)
        let totalSize = 0

        files.forEach((file) => {
            const filePath = path.join(CACHE_DIR, file)
            const stats = fs.statSync(filePath)
            totalSize += stats.size
        })

        return {
            totalCached: files.length,
            cacheSize: totalSize,
            cacheDir: CACHE_DIR,
        }
    } catch (error) {
        console.warn("⚠️ Failed to get cache stats:", error)
        return { totalCached: 0, cacheSize: 0, cacheDir: CACHE_DIR }
    }
}
