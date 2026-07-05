"use client"

import { useState } from "react"

const FAQS = [
  {
    question: "What is ResumeIQ?",
    answer:
      "ResumeIQ is a recruiter-grade analysis platform that evaluates your resume, LinkedIn, and GitHub profiles to help you understand how hiring teams perceive your profile.",
  },
  {
    question: "Is ResumeIQ free to use?",
    answer:
      "ResumeIQ currently offers core analysis features for free. Advanced insights and premium tooling will be introduced later as the platform evolves.",
  },
  {
    question: "How accurate is the resume analysis?",
    answer:
      "Our analysis logic is designed around real-world recruiter signals such as ATS compatibility, keyword relevance, and structural clarity.",
  },
  {
    question: "Do you store my resume or personal data?",
    answer:
      "No. During this phase, ResumeIQ does not permanently store resumes or personal data. Privacy and security are first-class priorities.",
  },
  {
    question: "Can I use ResumeIQ for internships and entry-level roles?",
    answer:
      "Absolutely. ResumeIQ is particularly effective for students, freshers, and early-career professionals looking to understand industry expectations.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-4xl px-6 py-20">

        {/* Section header */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Clear answers to common questions about ResumeIQ.
          </p>
        </div>

        {/* FAQ items */}
        <div className="divide-y divide-white/5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <button
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full py-6 text-left"
              >
                <div className="flex items-center justify-between gap-6">
                  <span className="text-base font-medium text-gray-100">
                    {faq.question}
                  </span>

                  <span className="text-xl font-light text-gray-500">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>

                {isOpen && (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                    {faq.answer}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
