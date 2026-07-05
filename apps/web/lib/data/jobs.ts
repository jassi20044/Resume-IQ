export interface Job {
    id: string
    title: string
    company: string
    location: string
    type: "Full-time" | "Remote" | "Contract" | "Hybrid"
    salary: string
    description: string
    skills: string[]
    postedAt: string
    logoColor: string
}

export const DUMMY_JOBS: Job[] = [
    {
        id: "1",
        title: "Senior Software Engineer",
        company: "TechNova Solutions",
        location: "San Francisco, CA",
        type: "Remote",
        salary: "$140k - $190k",
        description: "Join our core platform team to build scalable microservices using Node.js and React.",
        skills: ["Node.js", "React", "TypeScript", "AWS", "Microservices"],
        postedAt: "2 hours ago",
        logoColor: "bg-blue-500"
    },
    {
        id: "2",
        title: "Full Stack Developer",
        company: "CloudScale Systems",
        location: "New York, NY",
        type: "Hybrid",
        salary: "$120k - $160k",
        description: "Develop end-to-end features for our cloud management dashboard. Experience with Next.js is a plus.",
        skills: ["Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
        postedAt: "5 hours ago",
        logoColor: "bg-purple-500"
    },
    {
        id: "3",
        title: "Data Analyst",
        company: "Insight Analytics",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$90k - $130k",
        description: "Help us turn complex data into actionable insights for our retail partners.",
        skills: ["Python", "SQL", "Tableau", "Pandas", "Data Visualization"],
        postedAt: "1 day ago",
        logoColor: "bg-green-500"
    },
    {
        id: "4",
        title: "DevOps Engineer",
        company: "SecureNet Infrastructure",
        location: "Seattle, WA",
        type: "Remote",
        salary: "$150k - $210k",
        description: "Manage our Kubernetes clusters and CI/CD pipelines across multiple cloud providers.",
        skills: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Go"],
        postedAt: "3 days ago",
        logoColor: "bg-orange-500"
    },
    {
        id: "5",
        title: "Frontend Architect",
        company: "PixelPerfect UI",
        location: "Remote",
        type: "Remote",
        salary: "$170k - $230k",
        description: "Lead the technical direction of our design system and frontend performance optimization.",
        skills: ["React", "WebGL", "Performance Tuning", "Design Systems"],
        postedAt: "4 days ago",
        logoColor: "bg-pink-500"
    },
    {
        id: "6",
        title: "Backend Engineer",
        company: "FinTech Hub",
        location: "London, UK",
        type: "Hybrid",
        salary: "£80k - £110k",
        description: "Build secure and high-performance financial transaction systems using Rust and PostgreSQL.",
        skills: ["Rust", "PostgreSQL", "Redis", "Kafka"],
        postedAt: "1 week ago",
        logoColor: "bg-red-500"
    }
]
