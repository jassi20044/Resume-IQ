"use client"

import Link from "next/link"

const features = [
  {
    title: "Resume ATS Score",
    description:
      "Evaluate how well your resume passes Applicant Tracking Systems used by top recruiters.",
    accent: "border-indigo-500/40 text-indigo-400",
    href: "/main/ats-score",
  },
  {
    title: "LinkedIn Profile Analyzer",
    description:
      "Analyze headline, summary, experience, and keyword density to improve recruiter visibility.",
    accent: "border-sky-500/40 text-sky-400",
    href: "/main/linkedin-analyzer",
  },
  {
    title: "GitHub Profile Analyzer",
    description:
      "Review repositories, activity, README quality, and project relevance for hiring managers.",
    accent: "border-emerald-500/40 text-emerald-400",
    href: "/main/github-analyzer",
  },
  {
    title: "Skill Gap Detection",
    description:
      "Identify missing skills based on your target role and current resume or profile strength.",
    accent: "border-violet-500/40 text-violet-400",
  },
  {
    title: "Project Impact Review",
    description:
      "Analyze how effectively your projects demonstrate real-world impact and technical depth.",
    accent: "border-amber-500/40 text-amber-400",
  },
  {
    title: "Recruiter Readability Scan",
    description:
      "Ensure your profile can be scanned and understood by recruiters in under 10 seconds.",
    accent: "border-rose-500/40 text-rose-400",
  },
]

export default function AnalyzeSection() {
  return (
    <section id="analyze" className="px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

        {/* Section Header */}
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2 sm:mb-3">
            What ResumeIQ Can Do
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Powerful recruiter-style analysis tools designed to help students
            and early professionals stand out in modern hiring systems.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/10 p-4 sm:p-5 md:p-6 backdrop-blur-sm
                         hover:border-white/20 transition flex flex-col"
            >
              <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${feature.accent}`}>
                {feature.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 leading-relaxed flex-1">
                {feature.description}
              </p>

              {/* CTA */}
              {feature.href ? (
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition active:scale-95 px-3 py-2 rounded min-h-10"
                >
                  Try now →
                </Link>
              ) : (
                <span className="text-xs sm:text-sm font-medium text-gray-500 cursor-not-allowed px-3 py-2">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
