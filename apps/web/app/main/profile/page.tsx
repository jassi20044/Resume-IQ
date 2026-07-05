"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
// Authentication disabled for development
// import { useSession } from "next-auth/react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"

export default function ProfilePage() {
    // Authentication disabled - site is open
    // const { data: session, status } = useSession()
    const router = useRouter()

    // Auth redirect disabled
    // useEffect(() => {
    //     if (status === "unauthenticated") {
    //         router.push("/login")
    //     }
    // }, [status, router])

    // Loading state disabled - REMOVED
    // if (status === "loading") {
    //     return (
    //         <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex items-center justify-center">
    //             <div className="flex flex-col items-center gap-3">
    //                 <svg
    //                     className="h-8 w-8 animate-spin text-indigo-500"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     aria-label="Loading"
    //                 >
    //                     <circle
    //                         className="opacity-25"
    //                         cx="12"
    //                         cy="12"
    //                         r="10"
    //                         stroke="currentColor"
    //                         strokeWidth="4"
    //                     />
    //                     <path
    //                         className="opacity-75"
    //                         fill="currentColor"
    //                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    //                     />
    //                 </svg>
    //                 <p className="text-sm text-gray-400">Loading...</p>
    //             </div>
    //         </div>
    //     )
    // }

    // Safety guard disabled - authentication disabled
    // if (status !== "authenticated") {
    //     return null
    // }

    return (
        <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col overflow-hidden">
            {/* Cursor-based interactive glow */}
            <CursorGlow />

            {/* Global header */}
            <Header />

            {/* Main content */}
            <main className="relative z-10 flex-1 pt-6 sm:pt-8">
                <div className="max-w-4xl mx-auto px-6 py-12">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
                        <p className="text-gray-400">Manage your account settings and preferences</p>
                    </div>

                    {/* Profile Card */}
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 mb-6">

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-white/10">
                                D
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-1">
                                    Demo User
                                </h2>
                                <p className="text-gray-400">demo@resumeiq.com</p>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email Address
                                    </label>
                                    <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                                        demo@resumeiq.com
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Full Name
                                    </label>
                                    <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                                        Demo User
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                            <div className="text-2xl font-bold text-indigo-400 mb-1">0</div>
                            <div className="text-sm text-gray-400">ATS Scans</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                            <div className="text-2xl font-bold text-sky-400 mb-1">0</div>
                            <div className="text-sm text-gray-400">LinkedIn Analyses</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                            <div className="text-2xl font-bold text-emerald-400 mb-1">0</div>
                            <div className="text-sm text-gray-400">GitHub Reviews</div>
                        </div>
                    </div>

                    {/* Coming Soon Section */}
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-semibold text-amber-400 mb-1">More Features Coming Soon</h4>
                                <p className="text-sm text-gray-400">
                                    We're working on adding profile customization, usage analytics, and more!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}
