"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthPromptModalProps {
    isOpen: boolean
    onClose: () => void
    onContinue: () => void
    feature: string
}

export default function AuthPromptModal({
    isOpen,
    onClose,
    onContinue,
    feature,
}: AuthPromptModalProps) {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // ✅ CRITICAL: prevent server/client mismatch
    if (!mounted || !isOpen) return null

    const handleLogin = () => router.push("/login")
    const handleSignup = () => router.push("/signup")

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0B0F1A] p-6 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition"
                    aria-label="Close"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-amber-500/10 p-3">
                        <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-white">
                        Your Progress Won&apos;t Be Saved
                    </h2>
                    <p className="text-sm text-gray-400">
                        You&apos;re about to use{" "}
                        <span className="font-medium text-white">{feature}</span> as a guest.
                        Your analysis results won&apos;t be saved.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <button
                            onClick={handleLogin}
                            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleSignup}
                            className="flex-1 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                        >
                            Sign Up
                        </button>
                    </div>
                    <button
                        onClick={onContinue}
                        className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white"
                    >
                        Continue without saving
                    </button>
                </div>
            </div>
        </div>
    )
}
