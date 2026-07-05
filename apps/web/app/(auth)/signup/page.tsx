"use client"

import { Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CursorGlow from "@/components/shared/CursorGlow"

function SignupContent() {
    const router = useRouter()

    const handleGoogleSignup = async () => {
        await signIn("google", { callbackUrl: "/main" })
    }

    return (
        <div className="relative min-h-screen bg-[#0A0E1A] overflow-hidden">
            {/* Cursor-based interactive glow */}
            <CursorGlow />

            {/* Static background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-20 flex h-20 items-center justify-between px-4 sm:px-6 backdrop-blur-md">
                <Link href="/main" className="text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    ResumeIQ
                </Link>
                <span className="text-sm sm:text-lg text-gray-500 hidden sm:inline">
                    Recruiter-grade intelligence
                </span>
            </header>

            {/* Main content */}
            <main className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">
                <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
                    {/* Card header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-white">
                            Create Account
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Get started with ResumeIQ for free
                        </p>
                    </div>

                    {/* Google Sign up button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full rounded-md border border-gray-700 bg-[#0B0F1A] py-2.5 text-sm text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0E1A] mb-4"
                    >
                        <>
                            Continue with{" "}
                            <span className="font-semibold">
                                <span className="text-[#4285F4]">G</span>
                                <span className="text-[#DB4437]">o</span>
                                <span className="text-[#F4B400]">o</span>
                                <span className="text-[#4285F4]">g</span>
                                <span className="text-[#0F9D58]">l</span>
                                <span className="text-[#DB4437]">e</span>
                            </span>
                        </>
                    </button>

                    {/* Benefits */}
                    <div className="mt-6 rounded-lg bg-white/5 border border-white/10 p-4">
                        <p className="text-xs font-medium text-gray-400 mb-3">What you'll get:</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Save all your analysis results</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Track progress over time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Access from any device</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>100% free forever</span>
                            </li>
                        </ul>
                    </div>

                    {/* Login link */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition">
                            Sign in
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense
            fallback={
                <div className="relative min-h-screen bg-[#0A0E1A] overflow-hidden flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <svg
                            className="h-8 w-8 animate-spin text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-label="Loading"
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
                        <p className="text-sm text-gray-400">Loading...</p>
                    </div>
                </div>
            }
        >
            <SignupContent />
        </Suspense>
    )
}
