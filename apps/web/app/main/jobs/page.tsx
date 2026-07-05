"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"
import { DUMMY_JOBS, Job } from "@/lib/data/jobs"
import { Search, MapPin, Briefcase, DollarSign, Clock, ChevronRight } from "lucide-react"

export default function JobBoardPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<string>("All")

    const filteredJobs = DUMMY_JOBS.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesType = filterType === "All" || job.type === filterType
        
        return matchesSearch && matchesType
    })

    return (
        <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col">
            <CursorGlow />
            <Header />

            <main className="relative z-10 flex-1 pt-24 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Hero Section */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Find Your Next <span className="text-indigo-500">Dream Job</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Browse through thousands of high-paying tech roles specifically curated for your skills.
                            Analyze your resume to see which ones you match best.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="mb-12 grid gap-4 md:flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input 
                                type="text"
                                placeholder="Search by job title, company, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 pl-12 py-3 text-white placeholder-gray-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            {["All", "Full-time", "Remote", "Hybrid"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filterType === type 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Grid */}
                    <div className="grid gap-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <Link 
                                    key={job.id} 
                                    href={`/main/jobs/${job.id}`}
                                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col md:flex-row md:items-center gap-6"
                                >
                                    <div className={`h-16 w-16 rounded-xl ${job.logoColor} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                                        {job.company[0]}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {job.title}
                                            </h2>
                                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                                                {job.type}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="h-4 w-4 text-gray-500" />
                                                {job.company}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                {job.salary}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                {job.postedAt}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 md:max-w-[300px]">
                                        {job.skills.slice(0, 3).map(skill => (
                                            <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skills.length > 3 && (
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500">
                                                +{job.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all text-gray-500">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-white/10">
                                <Search className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-400">No jobs found matching your criteria</h3>
                                <p className="text-gray-600 mt-2">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
