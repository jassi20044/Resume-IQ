"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState<"about" | "experience" | "projects">("about")

  const experiences = [
    {
      company: "TATA AIA Life Insurance",
      role: "AI/ML Intern",
      period: "June 2025 – July 2025",
      achievements: [
        "Built machine learning models to predict insurance coverage amounts using 10+ customer attributes",
        "Executed data preprocessing, feature engineering, and model evaluation on structured datasets"
      ]
    },
    {
      company: "Yugasa Software Labs",
      role: "Web Developer Intern",
      period: "July 2025 – August 2025",
      achievements: [
        "Built 3+ web application features using Node.js and PHP technologies",
        "Contributed to front-end and back-end development across 3+ application modules"
      ]
    }
  ]

  const projects = [
    {
      title: "DevOps-Driven Portfolio Deployment",
      tech: "Next.js, React, Docker, GitHub Actions, AWS EC2, Nginx",
      year: "2025",
      description: [
        "Built and deployed a production-grade portfolio application using Next.js and React",
        "Implemented a CI/CD pipeline using GitHub Actions to automate linting, build, and Docker image creation",
        "Deployed the Dockerized application on AWS EC2 with Nginx as a reverse proxy"
      ]
    },
    {
      title: "Automatic Attendance System (Face Recognition)",
      tech: "Python, OpenCV",
      year: "2025",
      description: [
        "Developed an automated attendance system using face recognition with OpenCV for real-time user identification",
        "Implemented data storage and reporting features to log attendance efficiently"
      ]
    },
    {
      title: "Job Search Mobile Application",
      tech: "Android, Kotlin",
      year: "2025",
      description: [
        "Developed an Android-based job search application for browsing and applying to job listings",
        "Implemented user-friendly interfaces with backend integration to manage job data"
      ]
    }
  ]

  const skills = {
    programming: ["C", "C++", "JavaScript", "Python", "SQL", "HTML", "CSS"],
    frameworks: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "MySQL"],
    devops: ["Docker", "GitHub Actions (CI/CD)", "Nginx", "AWS EC2", "Linux (Ubuntu)"],
    tools: ["Git", "GitHub", "Visual Studio Code", "Android Studio", "SSMS"]
  }

  const certifications = [
    "Introduction to Generative AI and Large Language Models — Google Cloud",
    "Generative AI and Agents — Microsoft",
    "Data Analytics with Python — IBM SkillsBuild",
    "Android App Development — Google Developers"
  ]

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col">
      <CursorGlow />
      <Header />

      <main className="relative z-10 flex-1 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
          {/* Hero Section */}
          <div className="mb-10 sm:mb-14">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  About the Developer
                </h1>
                <p className="mt-2 sm:mt-3 text-sm text-gray-400">
                  Meet Harman Singh, the creator behind ResumeIQ
                </p>
              </div>
              
              {/* Contact Links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/harmansingh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/harmansingh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="mailto:Harman.singh.23cse@bmu.edu.in"
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 border-b border-white/10">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "about"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                About & Skills
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "experience"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "projects"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Projects
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* About & Skills Tab */}
            {activeTab === "about" && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* About Section */}
                <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-lg font-semibold text-white">About Me</h2>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    I'm a Computer Science and Engineering student at BML Munjal University with strong experience 
                    in full-stack development and hands-on exposure to DevOps workflows. I specialize in building 
                    scalable, production-ready software solutions by applying analytical problem-solving skills.
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    ResumeIQ was born from my passion for helping job seekers optimize their resumes for modern 
                    ATS systems. This platform combines my expertise in web development, AI/ML, and user experience 
                    design to create a tool that makes resume optimization accessible to everyone.
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="mb-3 text-sm font-medium text-gray-400">Education</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-white">Bachelor's in Computer Science and Engineering</p>
                        <p className="text-xs text-gray-400">BML Munjal University • Expected Graduation: 2027</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Senior Secondary Education</p>
                        <p className="text-xs text-gray-400">RPS International School • Graduated: 2023</p>
                        <p className="text-xs text-gray-500">12th: 75.2% | 10th: 92.8%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Programming Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.programming.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Frameworks & Libraries</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.frameworks.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-300 border border-green-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">DevOps & Cloud</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.devops.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 border border-blue-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase tracking-wide">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 border border-purple-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                        <p className="text-sm text-indigo-400">{exp.company}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-md w-fit">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                          <span className="text-indigo-400 mt-1.5 flex-shrink-0">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Certifications */}
                <div className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-semibold text-white">Certifications</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg bg-white/5 p-3 border border-white/5"
                      >
                        <svg className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <p className="text-xs text-gray-300">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <span className="text-xs font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-md w-fit">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-400 mb-4 font-medium">{project.tech}</p>
                    <ul className="space-y-2">
                      {project.description.map((desc, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                          <span className="text-indigo-400 mt-1.5 flex-shrink-0">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-12 rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 text-center backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-3">Get in Touch</h2>
            <p className="text-sm text-gray-300 mb-6 max-w-2xl mx-auto">
              Interested in collaborating or have questions about ResumeIQ? Feel free to reach out!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="mailto:Harman.singh.23cse@bmu.edu.in"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Me
              </a>
              <a
                href="tel:8076618658"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Me
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}