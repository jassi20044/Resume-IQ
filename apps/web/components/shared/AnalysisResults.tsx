import { ArrowRight, Download, Share2, Briefcase, MapPin, DollarSign, ExternalLink } from "lucide-react"
import { DUMMY_JOBS } from "@/lib/data/jobs"
import Link from "next/link"
import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface Breakdown {
  formatting: { score: number; feedback: string[] }
  keywords: {
    score: number
    matchedKeywords: string[]
    missingKeywords: string[]
    feedback: string[]
  }
  structure: { score: number; feedback: string[] }
  content: { score: number; feedback: string[] }
}

interface Suggestion {
  category: "Keywords" | "Formatting" | "Content" | "Structure"
  priority: "high" | "medium" | "low"
  issue: string
  suggestion: string
  example: string
  impact: string
}

interface AnalysisResultsProps {
  score: number
  overallAnalysis: string
  breakdown: Breakdown
  suggestions: Suggestion[]
  strengths: string[]
  weaknesses: string[]
  cached?: boolean
  isCached?: boolean
  cacheDate?: string
}

export default function AnalysisResults({
  score,
  overallAnalysis,
  breakdown,
  suggestions,
  strengths,
  weaknesses,
  cached,
  isCached,
  cacheDate,
}: AnalysisResultsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const displayCached = cached || isCached

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return
    setIsDownloading(true)

    try {
      const element = reportRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0B0F1A", // Match app background
      })
      
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`ResumeIQ-Analysis-Report-${score}.pdf`)
    } catch (error) {
      console.error("PDF Generation failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  // Determine score color and category
  const getScoreColor = (value: number) => {
    if (value >= 80) return { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", label: "Excellent" }
    if (value >= 65) return { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", label: "Good" }
    return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", label: "Needs Work" }
  }

  const colors = getScoreColor(score)

  return (
    <div ref={reportRef} className="space-y-6 sm:space-y-8 p-1">
      {/* Cached indicator */}
      {displayCached && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 sm:p-4 flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6-4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-400">⚡ Instant Result (Cached)</p>
            <p className="text-xs text-blue-300/70">
              {cacheDate ? `Previously analyzed on ${new Date(cacheDate).toLocaleDateString()}` : "Same resume + role returns consistent score"}
            </p>
          </div>
        </div>
      )}

      {/* Score Overview Card */}
      <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 sm:p-8`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Large Score Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-full border-8 border-current border-opacity-20 flex items-center justify-center bg-current bg-opacity-5">
              <div className="text-center">
                <div className={`text-6xl sm:text-7xl font-bold ${colors.text}`}>{score}</div>
                <div className="text-sm sm:text-base text-gray-400 mt-1">/100</div>
              </div>
            </div>
            <p className={`mt-4 text-lg sm:text-xl font-semibold ${colors.text}`}>
              {colors.label}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { name: "Formatting", value: breakdown.formatting.score, max: 25 },
              { name: "Keywords", value: breakdown.keywords.score, max: 35 },
              { name: "Structure", value: breakdown.structure.score, max: 20 },
              { name: "Content", value: breakdown.content.score, max: 20 },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-medium text-gray-300">{cat.name}</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-400">
                    {cat.value}/{cat.max}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (cat.value / cat.max) * 100 >= 80
                        ? "bg-green-500"
                        : (cat.value / cat.max) * 100 >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${(cat.value / cat.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 sm:p-6`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${colors.bg} border ${colors.border}`}>
            <svg className={`h-4 w-4 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className={`text-sm sm:text-base font-bold ${colors.text}`}>Detailed AI Analysis</h3>
        </div>
        <div className="space-y-4">
          <p className={`${colors.text} text-sm sm:text-base font-semibold leading-relaxed`}>
            {score >= 85
              ? "✓ Excellent Alignment"
              : score >= 75
                ? "✓ Good Alignment"
                : score >= 65
                  ? "⚠ Moderate Alignment"
                  : "✗ Low Alignment"}
          </p>
          <div className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-wrap">
            {overallAnalysis}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Strengths */}
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-green-400 mb-3 sm:mb-4">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-green-300/80 flex gap-2">
                <span className="flex-shrink-0 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-orange-400 mb-3 sm:mb-4">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Areas to Improve
          </h3>
          <ul className="space-y-2">
            {weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-orange-300/80 flex gap-2">
                <span className="flex-shrink-0 mt-1">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="space-y-4 sm:space-y-6">
        {/* Formatting */}
        <details className="group rounded-xl border border-white/10 overflow-hidden">
          <summary className="flex cursor-pointer items-center justify-between bg-white/5 p-4 sm:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-400">{breakdown.formatting.score}</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white">Formatting</h4>
            </div>
            <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="border-t border-white/10 p-4 sm:p-6 bg-white/2">
            <ul className="space-y-2">
              {breakdown.formatting.feedback.map((fb, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-gray-300 flex gap-2">
                  <span className="text-blue-400 mt-0.5">→</span>
                  <span>{fb}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Keywords */}
        <details className="group rounded-xl border border-white/10 overflow-hidden">
          <summary className="flex cursor-pointer items-center justify-between bg-white/5 p-4 sm:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-400">{breakdown.keywords.score}</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white">Keywords & Skills</h4>
            </div>
            <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="border-t border-white/10 p-4 sm:p-6 bg-white/2 space-y-4">
            {breakdown.keywords.matchedKeywords.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-semibold text-green-400 mb-2">✓ Matched Keywords ({breakdown.keywords.matchedKeywords.length})</p>
                <div className="flex flex-wrap gap-2">
                  {breakdown.keywords.matchedKeywords.map((kw, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {breakdown.keywords.missingKeywords.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-semibold text-orange-400 mb-2">⚠ Missing Keywords ({breakdown.keywords.missingKeywords.length})</p>
                <div className="flex flex-wrap gap-2">
                  {breakdown.keywords.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 pt-2">
              {breakdown.keywords.feedback.map((fb, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-gray-300 flex gap-2">
                  <span className="text-purple-400 mt-0.5">→</span>
                  <span>{fb}</span>
                </p>
              ))}
            </div>
          </div>
        </details>

        {/* Structure */}
        <details className="group rounded-xl border border-white/10 overflow-hidden">
          <summary className="flex cursor-pointer items-center justify-between bg-white/5 p-4 sm:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-400">{breakdown.structure.score}</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white">Structure</h4>
            </div>
            <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="border-t border-white/10 p-4 sm:p-6 bg-white/2">
            <ul className="space-y-2">
              {breakdown.structure.feedback.map((fb, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-gray-300 flex gap-2">
                  <span className="text-indigo-400 mt-0.5">→</span>
                  <span>{fb}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Content */}
        <details className="group rounded-xl border border-white/10 overflow-hidden">
          <summary className="flex cursor-pointer items-center justify-between bg-white/5 p-4 sm:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-400">{breakdown.content.score}</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white">Content Quality</h4>
            </div>
            <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="border-t border-white/10 p-4 sm:p-6 bg-white/2">
            <ul className="space-y-2">
              {breakdown.content.feedback.map((fb, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-gray-300 flex gap-2">
                  <span className="text-orange-400 mt-0.5">→</span>
                  <span>{fb}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      {/* Actionable Suggestions */}
      {suggestions.length > 0 && (
        <div className="rounded-xl border border-white/10 p-4 sm:p-6 bg-white/5">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
            📋 Actionable Suggestions
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {suggestions
              .sort((a) => (a.priority === "high" ? -1 : a.priority === "medium" ? 0 : 1))
              .map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-4 sm:p-5 ${
                    suggestion.priority === "high"
                      ? "border-red-500/20 bg-red-500/5"
                      : suggestion.priority === "medium"
                        ? "border-yellow-500/20 bg-yellow-500/5"
                        : "border-blue-500/20 bg-blue-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          suggestion.priority === "high"
                            ? "bg-red-500/20 text-red-300"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {suggestion.priority.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-semibold text-white">{suggestion.issue}</p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">{suggestion.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 ml-0 sm:ml-8">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-300">Suggestion:</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{suggestion.suggestion}</p>
                    </div>

                    {suggestion.example && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-300">Example:</p>
                        <div className="mt-1 p-2 sm:p-3 rounded bg-black/30 border border-white/5">
                          <p className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                            {suggestion.example}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-gray-500">Expected impact:</span>
                      <span className="font-semibold text-green-400">{suggestion.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Download Full Report
            </>
          )}
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-gray-300 transition-all hover:bg-white/10">
          <Share2 className="h-4 w-4" /> Share Results
        </button>
      </div>

      {/* Recommended Jobs Expansion */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                Recommended Jobs for You
            </h3>
            <Link href="/main/jobs" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors">
                View All Jobs <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_JOBS.slice(0, 3).map((job) => (
                <Link 
                    key={job.id} 
                    href={`/main/jobs/${job.id}`}
                    className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:bg-white/10"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`h-12 w-12 rounded-xl ${job.logoColor} flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
                            {job.company[0]}
                        </div>
                        <div>
                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate max-w-[150px]">
                                {job.title}
                            </h4>
                            <p className="text-xs text-gray-500">{job.company}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <MapPin className="h-3 w-3 text-gray-600" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <DollarSign className="h-3 w-3 text-gray-600" /> {job.salary}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <Briefcase className="h-3 w-3 text-gray-600" /> {job.type}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                            {score > 70 ? "90% Match" : "Highly Relevant"}
                        </span>
                        <div className="text-gray-500 group-hover:text-indigo-400 transition-colors">
                            <ExternalLink className="h-4 w-4" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
