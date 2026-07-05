"use client"

import { useState, useEffect, FormEvent } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"

interface FormErrors {
  githubUrl?: string
  role?: string
  general?: string
}

export default function GitHubAnalyzerPage() {
  const [githubUrl, setGithubUrl] = useState("")
  const [role, setRole] = useState("")
  const [score, setScore] = useState<number | null>(null)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Reset score if inputs change
  useEffect(() => {
    setScore(null)
    setErrors({})
  }, [githubUrl, role])

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!githubUrl.trim()) {
      setErrors({ githubUrl: "GitHub URL is required" })
      return
    }
    if (!role.trim()) {
      setErrors({ role: "Target role is required" })
      return
    }

    setErrors({})
    setLoading(true)
    setAnalysisData(null)

    try {
      const response = await fetch("/api/github-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUrl,
          targetRole: role
        }),
      })

      const data = await response.json()

      if (data.success) {
        setScore(data.analysis.score)
        setAnalysisData(data.analysis)
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({
        general: "An error occurred while analyzing your GitHub profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = githubUrl.trim() && role.trim()

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col">
      <CursorGlow />
      <Header />

      <main className="relative z-10 flex-1 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
          {/* Page header */}
          <div className="mb-10 sm:mb-14 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              GitHub Profile Analyzer
            </h1>
            <p className="mt-2 sm:mt-3 text-sm text-gray-400">
              Analyze your GitHub repositories, code quality, and technical impact 
              to see how you rank against your target job role.
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="mb-6 rounded-md bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1 whitespace-pre-line">{errors.general}</span>
            </div>
          )}

          {/* Main grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT: Inputs or Results */}
            <div className="lg:col-span-2 space-y-6">
              {!analysisData ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* GitHub URL input */}
                  <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm bg-white/5">
                    <label htmlFor="github-url" className="mb-2 block text-sm font-medium text-gray-300">
                      GitHub Profile URL
                    </label>
                    <input
                      id="github-url"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                    {errors.githubUrl && <p className="mt-1 text-xs text-red-400">{errors.githubUrl}</p>}
                  </div>

                  {/* Target role */}
                  <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm bg-white/5">
                    <label htmlFor="job-role" className="mb-2 block text-sm font-medium text-gray-300">
                      Targeted Job Role
                    </label>
                    <input
                      id="job-role"
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                    {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full rounded-md bg-indigo-600 py-4 text-base font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {loading ? "Scanning GitHub..." : "Analyze GitHub Profile"}
                  </button>
                </form>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Results Card */}
                  <div className="rounded-xl border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                      <div className="relative h-40 w-40 rounded-full border-8 border-green-500/20 flex items-center justify-center bg-green-500/5">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-green-400">{score}</div>
                          <div className="text-xs text-gray-500 mt-1">DEV SCORE</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Technical Impact Summary</h3>
                        <p className="text-gray-400 leading-relaxed italic text-sm">
                          "{analysisData.overallAnalysis}"
                        </p>
                      </div>
                    </div>

                    {/* Section Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(analysisData.sections).map(([name, data]: [string, any]) => (
                        <div key={name} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold capitalize text-gray-300">{name}</span>
                            <span className="text-xs font-bold text-green-400">{data.score}</span>
                          </div>
                          <ul className="space-y-1">
                            {data.feedback.map((f: string, i: number) => (
                              <li key={i} className="text-[10px] text-gray-500 flex gap-1">
                                <span className="text-green-500">•</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Roadmap to Senior Engineer</h3>
                    <div className="grid gap-4">
                      {analysisData.suggestions.map((s: any, i: number) => (
                        <div key={i} className={`p-5 rounded-xl border ${
                          s.priority === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-blue-500/5 border-blue-500/20'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              s.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {s.priority} Priority
                            </span>
                            <h4 className="text-sm font-bold text-white">{s.issue}</h4>
                          </div>
                          <p className="text-sm text-gray-400">{s.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setAnalysisData(null)}
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    ← Analyze another GitHub profile
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Stats / Empty state */}
            {!analysisData && (
              <div className="rounded-xl border border-white/10 p-8 bg-white/5 backdrop-blur-sm h-fit">
                <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider text-center">Scan Preview</h3>
                <div className="text-7xl font-bold text-gray-800 text-center py-10 opacity-50">—</div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Code Quality Analysis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Project Complexity
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Documentation Quality
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
