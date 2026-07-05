"use client"

import { useEffect, useState } from "react"

interface ProcessStep {
  id: string
  label: string
  status: "idle" | "in-progress" | "completed" | "error"
  message?: string
}

interface AnalysisProgressProps {
  isAnalyzing: boolean
  currentStep?: string
}

export default function AnalysisProgress({ isAnalyzing, currentStep }: AnalysisProgressProps) {
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: "extracting",
      label: "Extracting Resume Text",
      status: "idle",
      message: "Reading your PDF file...",
    },
    {
      id: "checking",
      label: "Checking Cache",
      status: "idle",
      message: "Looking for previous analysis...",
    },
    {
      id: "analyzing",
      label: "AI Analysis",
      status: "idle",
      message: "Analyzing with Gemini AI...",
    },
    {
      id: "formatting",
      label: "Generating Report",
      status: "idle",
      message: "Preparing your ATS score...",
    },
  ])

  // Update step status based on currentStep
  useEffect(() => {
    if (!currentStep) return

    const stepMap: Record<string, string> = {
      extracting: "extracting",
      cache: "checking",
      ai: "analyzing",
      report: "formatting",
    }

    const targetStepId = stepMap[currentStep] || currentStep

    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === targetStepId) {
          return { ...step, status: "in-progress" }
        }
        // Mark previous steps as completed
        if (
          prev.findIndex((s) => s.id === targetStepId) > prev.findIndex((s) => s.id === step.id)
        ) {
          return { ...step, status: "completed" }
        }
        return step
      })
    )
  }, [currentStep])

  // Reset when analysis starts
  useEffect(() => {
    if (!isAnalyzing) {
      setSteps((prev) =>
        prev.map((step) => ({ ...step, status: "idle" }))
      )
    } else {
      // Start with first step
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === 0 ? { ...step, status: "in-progress" } : step
        )
      )
    }
  }, [isAnalyzing])

  if (!isAnalyzing) return null

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6 sm:p-8 backdrop-blur-sm">
      <div className="space-y-4 sm:space-y-6">
        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`relative h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.status === "completed"
                    ? "border-green-500 bg-green-500/10"
                    : step.status === "in-progress"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-gray-700 bg-gray-900/50"
                }`}
              >
                {step.status === "completed" ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : step.status === "in-progress" ? (
                  <svg
                    className="h-5 w-5 animate-spin text-indigo-400"
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
                ) : (
                  <span className="text-gray-500 font-medium text-sm">{index + 1}</span>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-1 h-6 sm:h-8 mt-2 transition-colors ${
                    step.status === "completed"
                      ? "bg-green-500/50"
                      : step.status === "in-progress"
                        ? "bg-indigo-500/30"
                        : "bg-gray-700/30"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 pt-1">
              <div className="flex items-baseline justify-between">
                <h4
                  className={`text-sm sm:text-base font-medium transition-colors ${
                    step.status === "completed"
                      ? "text-green-400"
                      : step.status === "in-progress"
                        ? "text-indigo-400"
                        : "text-gray-500"
                  }`}
                >
                  {step.label}
                </h4>
              </div>
              {step.message && (
                <p className="mt-1 text-xs sm:text-sm text-gray-400">
                  {step.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6 sm:mt-8 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
            style={{
              width: `${
                (steps.filter((s) => s.status === "completed").length / steps.length) * 100
              }%`,
            }}
            role="progressbar"
            aria-valuenow={steps.filter((s) => s.status === "completed").length}
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-label="Analysis progress"
          />
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
          {steps.filter((s) => s.status === "completed").length}/{steps.length}
        </span>
      </div>
    </div>
  )
}
