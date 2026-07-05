"use client"

import Image from "next/image"

interface Feature {
  title: string
  description: string
  image: string
  alt: string
}

const features: Feature[] = [
  {
    title: "Recruiter-Grade Resume Analysis",
    description:
      "Understand how your resume is read in the first 6–10 seconds and what actually matters for shortlisting.",
    image: "/about-resume.png",
    alt: "Resume analysis illustration showing ATS compatibility and recruiter review process",
  },
  {
    title: "LinkedIn & Profile Strength",
    description:
      "Improve visibility, keyword relevance, and clarity where recruiters actually search.",
    image: "/about-linkedin.png",
    alt: "LinkedIn profile optimization showing headline, summary, and keyword analysis",
  },
  {
    title: "Projects That Speak for You",
    description:
      "Analyze GitHub activity, repositories, and impact to make projects hiring-relevant — not just present.",
    image: "/about-github.png",
    alt: "GitHub profile analysis showing repository quality and project impact metrics",
  },
]

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="px-6 py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 
            id="about-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold italic text-white"
          >
            About ResumeIQ
          </h2>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Built to help you stand out — not blend in.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <article 
              key={feature.title}
              className="group space-y-4"
            >
              {/* Feature Image */}
              <div className="relative h-20 w-20 mx-auto">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  sizes="80px"
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  priority={index === 0}
                  quality={90}
                />
              </div>

              {/* Feature Content */}
              <div className="space-y-2 text-center">
                <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Optional: Value Proposition */}
        <div className="text-center max-w-2xl mx-auto pt-8">
          <p className="text-xs sm:text-sm text-gray-500 italic">
            ResumeIQ combines AI-powered analysis with real recruiter insights to help 
            you optimize every touchpoint of your professional presence.
          </p>
        </div>

      </div>
    </section>
  )
}