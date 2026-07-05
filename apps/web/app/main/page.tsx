"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"

import HeroSection from "@/components/landing/HeroSection"
import AnalyzeSection from "@/components/landing/AnalyzeSection"
import AboutSection from "@/components/landing/AboutSection"
import FAQSection from "@/components/landing/FAQSection"
import DeveloperSection from "@/components/landing/DeveloperSection"

export default function AppPage() {
  const { status } = useSession()

  // Handle hash-based navigation (e.g., /main#analyze)
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col overflow-hidden">
      {/* Cursor-based interactive glow */}
      <CursorGlow />

      {/* Global header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section - Full viewport height with centered content */}
        <section className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center pt-8 sm:pt-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroSection />
          </div>
        </section>

        {/* Content Sections - Consistent spacing and alignment */}
        <div className="w-full">
          {/* Analyze Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <AnalyzeSection />
          </div>

          {/* Divider */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* About Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <AboutSection />
          </div>

          {/* Divider */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* FAQ Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <FAQSection />
          </div>

          {/* Divider */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Developer Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <DeveloperSection />
          </div>

          {/* Bottom spacing before footer */}
          <div className="h-8 sm:h-12" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}