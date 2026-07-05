"use client"

import { use } from "react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CursorGlow from "@/components/shared/CursorGlow"
import { DUMMY_JOBS } from "@/lib/data/jobs"
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Calendar, ShieldCheck, Share2 } from "lucide-react"
import { notFound } from "next/navigation"

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const job = DUMMY_JOBS.find(j => j.id === id)

    if (!job) {
        return notFound()
    }

    return (
        <div className="relative min-h-screen bg-[#0B0F1A] text-gray-100 flex flex-col">
            <CursorGlow />
            <Header />

            <main className="relative z-10 flex-1 pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    {/* Back link */}
                    <Link href="/main/jobs" className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors mb-8 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Job Board
                    </Link>

                    {/* Job Header Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md mb-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className={`h-24 w-24 rounded-2xl ${job.logoColor} flex items-center justify-center text-4xl font-bold text-white shadow-2xl`}>
                                {job.company[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-bold text-white tracking-tight">{job.title}</h1>
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                        {job.type}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-indigo-500" />
                                        <span className="font-medium text-gray-200">{job.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-indigo-500" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-indigo-500" />
                                        {job.salary}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                                    Apply Now
                                </button>
                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-10 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                                    About the Role
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {job.description}
                                    <br /><br />
                                    As a {job.title} at {job.company}, you will be responsible for building next-generation systems that touch millions of users. We are looking for someone who is passionate about clean code, scalable architecture, and solving complex problems with elegant solutions.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                                    What we're looking for
                                </h3>
                                <ul className="grid gap-4">
                                    {job.skills.map((skill, index) => (
                                        <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                                            <ShieldCheck className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                                            <div>
                                                <div className="font-bold text-white">{skill}</div>
                                                <div className="text-sm text-gray-500">Professional experience with {skill} and modern best practices.</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                                    Perks & Benefits
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {["Premium Health Coverage", "Unlimited PTO", "Remote Work Stipend", "Learning Budget"].map(perk => (
                                        <div key={perk} className="p-4 rounded-xl border border-white/5 bg-white/5 text-gray-300 text-sm">
                                            • {perk}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
                                <h4 className="font-bold text-white">Job Overview</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Posted
                                        </span>
                                        <span className="text-gray-300">{job.postedAt}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Type
                                        </span>
                                        <span className="text-gray-300">{job.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> Location
                                        </span>
                                        <span className="text-gray-300">{job.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-indigo-600/10 border border-indigo-500/20 p-6">
                                <h4 className="font-bold text-white mb-2">Want to get hired?</h4>
                                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                    Improve your chances by analyzing your resume for this specific role.
                                </p>
                                <Link 
                                    href="/main/ats-score"
                                    className="block w-full py-2 text-center rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
                                >
                                    Scan Resume Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
