"use client"

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
// Authentication disabled - import removed
// import { useSession } from "next-auth/react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"
import AnalysisProgress from "@/components/shared/AnalysisProgress"
import AnalysisResults from "@/components/shared/AnalysisResults"

interface FormErrors {
  file?: string
  role?: string
  general?: string
}

export default function ATSPage() {
  // Authentication disabled for development/demo
  // const { status } = useSession()
  const router = useRouter()

  // ===== ALL HOOKS MUST BE AT THE TOP =====
  const [file, setFile] = useState<File | null>(null)
  const [role, setRole] = useState("")
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState({ file: false, role: false })
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const roleInputRef = useRef<HTMLInputElement>(null)

  // Authentication check disabled - site is open
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login?callbackUrl=/main/ats-score")
  //   }
  // }, [status, router])

  // Persistence: Load last analysis from localStorage on mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem("last_ats_analysis")
    const savedScore = localStorage.getItem("last_ats_score")
    const savedRole = localStorage.getItem("last_ats_role")
    
    if (savedAnalysis && savedScore && savedRole) {
      try {
        setAnalysisData(JSON.parse(savedAnalysis))
        setScore(Number(savedScore))
        setRole(savedRole)
      } catch (e) {
        console.error("Failed to load saved analysis", e)
      }
    }
  }, [])

  // Reset score if inputs change (keep role if it matches saved one)
  useEffect(() => {
    if (analysisData && role !== localStorage.getItem("last_ats_role")) {
      setScore(null)
      setErrors({})
    }
  }, [file, role])

  // ===== NOW CONDITIONAL RETURNS CAN HAPPEN =====

  // Prevent UI flash while auth status is resolving - DISABLED
  // if (status === "loading") {
  //   return (
  //     <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-3">
  //         <svg
  //           className="h-8 w-8 animate-spin text-indigo-500"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           aria-label="Loading"
  //         >
  //           <circle
  //             className="opacity-25"
  //             cx="12"
  //             cy="12"
  //             r="10"
  //             stroke="currentColor"
  //             strokeWidth="4"
  //           />
  //           <path
  //             className="opacity-75"
  //             fill="currentColor"
  //             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //           />
  //         </svg>
  //         <p className="text-sm text-gray-400">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // Safety guard - don't render if not authenticated - DISABLED
  // if (status !== "authenticated") {
  //   return null
  // }

  // ===== HELPER FUNCTIONS =====

  // Validate file
  const validateFile = (file: File | null): string | undefined => {
    if (!file) {
      return "Please upload a resume file"
    }
    if (file.type !== "application/pdf") {
      return "Only PDF files are supported"
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB"
    }
    return undefined
  }

  // Validate role
  const validateRole = (value: string): string | undefined => {
    if (!value.trim()) {
      return "Please enter a job role"
    }
    if (value.trim().length < 3) {
      return "Job role must be at least 3 characters"
    }
    if (value.trim().length > 100) {
      return "Job role must be less than 100 characters"
    }
    return undefined
  }

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setErrors((prev) => ({ ...prev, file: undefined, general: undefined }))

    if (selectedFile) {
      const error = validateFile(selectedFile)
      if (error) {
        setErrors((prev) => ({ ...prev, file: error }))
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        setFile(null)
      }
    }
  }

  // Handle role change
  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRole(value)
    setErrors((prev) => ({ ...prev, role: undefined, general: undefined }))
    if (touched.role) {
      const error = validateRole(value)
      setErrors((prev) => ({ ...prev, role: error }))
    }
  }

  // Handle role blur
  const handleRoleBlur = () => {
    setTouched((prev) => ({ ...prev, role: true }))
    const error = validateRole(role)
    setErrors((prev) => ({ ...prev, role: error }))
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({ file: true, role: true })

    // Validate form
    const fileError = validateFile(file)
    const roleError = validateRole(role)

    if (fileError || roleError) {
      setErrors({
        file: fileError,
        role: roleError,
      })
      // Focus first error field
      if (fileError) {
        fileInputRef.current?.focus()
      } else if (roleError) {
        roleInputRef.current?.focus()
      }
      return
    }

    // Clear errors and analyze
    setErrors({})
    setLoading(true)
    setAnalysisData(null)
    setCurrentStep("extracting")

    try {
      // Simulate extracting
      await new Promise(resolve => setTimeout(resolve, 500))
      setCurrentStep("checking")

      // Create FormData for API request
      const formData = new FormData()
      formData.append("resume", file!)
      formData.append("targetRole", role.trim())

      console.log("Sending request to /api/ats-score with:", {
        fileName: file!.name,
        fileSize: file!.size,
        fileType: file!.type,
        targetRole: role.trim()
      })

      // Simulate cache check delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setCurrentStep("analyzing")

      // Call the ATS analysis API
      const response = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)
        throw new Error(errorData.error || "Failed to analyze resume")
      }

      const data = await response.json()
      console.log("API Success Response:", data)

      setCurrentStep("formatting")
      await new Promise(resolve => setTimeout(resolve, 500))

      if (data.success && data.analysis) {
        setScore(data.analysis.score)
        setAnalysisData(data.analysis)
        setCurrentStep("")
        
        // Save to persistence
        localStorage.setItem("last_ats_analysis", JSON.stringify(data.analysis))
        localStorage.setItem("last_ats_score", data.analysis.score.toString())
        localStorage.setItem("last_ats_role", role.trim())
      } else {
        throw new Error(data.error || "Analysis failed")
      }
    } catch (error) {
      console.error("ATS analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred while analyzing your resume. Please try again."
      setErrors({
        general: errorMessage,
      })
      setCurrentStep("")
    } finally {
      setLoading(false)
    }
  }

  // Remove file
  const removeFile = () => {
    setFile(null)
    setErrors((prev) => ({ ...prev, file: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isFormValid = !validateFile(file) && !validateRole(role) && file && role.trim()

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col">
      <CursorGlow />
      <Header />

      <main className="relative z-10 flex-1 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
          {/* Page header */}
          <div className="mb-10 sm:mb-14 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              ATS Score Analysis
            </h1>
            <p className="mt-2 sm:mt-3 text-sm text-gray-400">
              Check how well your resume aligns with Applicant Tracking Systems
              for a specific job role.
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 flex items-start gap-2"
            >
              <svg
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="flex-1">{errors.general}</span>
              <button
                onClick={() => setErrors((prev) => ({ ...prev, general: undefined }))}
                className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                aria-label="Dismiss error"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Main grid */}
          <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-3">
            {/* LEFT: Inputs or Results */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {!analysisData ? (
                <>
                  <form onSubmit={handleSubmit} noValidate>
                {/* Resume upload */}
                <div className="rounded-xl border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
                  <h2 className="mb-3 text-base sm:text-lg font-medium text-white">
                    Resume (PDF)
                  </h2>

                  {!file ? (
                    <div>
                      <label
                        htmlFor="resume-upload"
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 sm:px-6 py-8 sm:py-10 text-sm text-gray-400 transition-all ${touched.file && errors.file
                          ? "border-red-500/50 bg-red-500/5 hover:border-red-500/70"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                          }`}
                      >
                        <input
                          id="resume-upload"
                          ref={fileInputRef}
                          type="file"
                          name="resume"
                          accept="application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                          aria-invalid={touched.file && !!errors.file}
                          aria-describedby={touched.file && errors.file ? "file-error" : "file-help"}
                          disabled={loading}
                        />
                        <svg
                          className="h-8 w-8 mb-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="font-medium text-gray-300">
                          Upload your resume
                        </span>
                        <span className="mt-1 text-xs">
                          PDF format only (max 5MB)
                        </span>
                      </label>
                      {touched.file && errors.file && (
                        <p
                          id="file-error"
                          role="alert"
                          className="mt-2 text-xs text-red-400 flex items-center gap-1"
                        >
                          <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.file}
                        </p>
                      )}
                      <p id="file-help" className="mt-2 text-xs text-gray-500 sr-only">
                        Upload a PDF resume file. Maximum file size is 5MB.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-200 truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="ml-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                        aria-label={`Remove ${file.name}`}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Target role */}
                <div className="rounded-xl border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
                  <label
                    htmlFor="job-role"
                    className="mb-3 block text-base sm:text-lg font-medium text-white"
                  >
                    Targeted Job Role
                  </label>
                  <input
                    id="job-role"
                    ref={roleInputRef}
                    type="text"
                    name="jobRole"
                    value={role}
                    onChange={handleRoleChange}
                    onBlur={handleRoleBlur}
                    placeholder="e.g. Software Engineer, Data Analyst"
                    maxLength={100}
                    aria-invalid={touched.role && !!errors.role}
                    aria-describedby={touched.role && errors.role ? "role-error" : "role-help"}
                    className={`w-full rounded-md border px-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 min-h-12 sm:min-h-14 ${touched.role && errors.role
                      ? "border-red-500/50 bg-red-500/5 focus:ring-red-500/50"
                      : "border-white/10 bg-white/5 focus:ring-indigo-500 focus:border-indigo-500/50"
                      }`}
                    disabled={loading}
                  />
                  {touched.role && errors.role && (
                    <p
                      id="role-error"
                      role="alert"
                      className="mt-2 text-xs text-red-400 flex items-center gap-1"
                    >
                      <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.role}
                    </p>
                  )}
                  <p id="role-help" className="mt-1 text-xs text-gray-500 sr-only">
                    Enter the job role you are applying for. This helps us analyze your resume compatibility.
                  </p>
                </div>

                {/* Analyze CTA */}
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full rounded-md bg-indigo-600 px-4 py-3 sm:py-4 text-sm sm:text-base font-medium text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0B0F1A] disabled:cursor-not-allowed disabled:bg-indigo-600/50 disabled:hover:bg-indigo-600/50 min-h-12 sm:min-h-14 active:scale-95"
                  aria-busy={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze ATS Compatibility"
                  )}
                </button>
                  {/* Show progress during analysis */}
                  {loading && <AnalysisProgress isAnalyzing={loading} currentStep={currentStep} />}
                </form>
                </>
              ) : (
                <AnalysisResults
                  score={analysisData.score}
                  overallAnalysis={analysisData.overallAnalysis}
                  breakdown={analysisData.breakdown}
                  suggestions={analysisData.suggestions}
                  strengths={analysisData.strengths}
                  weaknesses={analysisData.weaknesses}
                  cached={analysisData.isCached}
                  cacheDate={analysisData.cacheDate}
                />
              )}
            </div>

            {/* RIGHT: ATS Score (simple display) */}
            {!analysisData && (
              <div className="flex flex-col justify-center rounded-xl border border-white/10 p-6 sm:p-8 text-center backdrop-blur-sm">
                <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wide text-gray-400">
                  ATS Score
                </h3>

                <div
                  className="my-6 text-5xl sm:text-6xl font-semibold text-white transition-all"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="h-12 w-12 animate-spin text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-label="Analyzing"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <>
                      {score !== null ? (
                        <span
                          className={
                            score >= 80 ? "text-green-400" : score >= 65 ? "text-yellow-400" : "text-red-400"
                          }
                        >
                          {score}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                      <span className="text-xl sm:text-2xl text-gray-400">/100</span>
                    </>
                  )}
                </div>

                <p className="mx-auto max-w-xs text-xs sm:text-sm text-gray-400">
                  Indicates how well your resume may perform in automated ATS
                  systems for the selected role.
                </p>

                {score !== null && !loading && (
                  <div
                    className={`mt-6 rounded-lg px-4 py-3 text-sm ${
                      score >= 80
                        ? "bg-green-500/10 text-green-300 border border-green-500/20"
                        : score >= 65
                          ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                          : "bg-red-500/10 text-red-300 border border-red-500/20"
                    }`}
                    role="status"
                  >
                    {score >= 80
                      ? "✓ Strong alignment. Resume is ATS-friendly."
                      : score >= 65
                        ? "⚠ Moderate alignment. Improvements recommended."
                        : "✗ Low alignment. Significant optimization needed."}
                  </div>
                )}

                {score === null && !loading && (
                  <div className="mt-6 rounded-lg bg-white/5 px-4 py-3 text-xs sm:text-sm text-gray-500">
                    Upload your resume and enter a job role to get started.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}