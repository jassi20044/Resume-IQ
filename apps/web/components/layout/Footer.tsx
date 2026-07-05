"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 backdrop-blur-sm">

        {/* Top section */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 lg:flex-row lg:items-center lg:justify-between">

          {/* Brand */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
              Resume<span className="text-indigo-500">IQ</span>
            </h2>
            <p className="mt-2 max-w-sm text-xs sm:text-sm text-gray-400 leading-relaxed">
              Recruiter-grade resume, LinkedIn, and GitHub intelligence to help
              you stand out professionally.
            </p>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
            <SocialLink
              href="https://www.linkedin.com/in/harman-singh-681758347/"
              label="LinkedIn"
            />
            <SocialLink
              href="https://github.com/hsk-2004"
              label="GitHub"
            />
            <SocialLink
              href="https://twitter.com/"
              label="X / Twitter"
            />
            <SocialLink
              href="mailto:harman.singh@email.com"
              label="Email"
            />
          </div>
        </div>

        {/* Divider (soft, glow-friendly) */}
        <div className="my-6 sm:my-10 h-px w-full bg-white/5" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 text-center lg:flex-row lg:text-left">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} ResumeIQ. All rights reserved.
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            Designed & developed by{" "}
            <span className="font-medium text-gray-300">
              Harman Singh
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="text-xs sm:text-sm text-gray-400 transition hover:text-white hover:underline px-2 py-1.5 rounded min-h-10 flex items-center"
    >
      {label}
    </Link>
  )
}
