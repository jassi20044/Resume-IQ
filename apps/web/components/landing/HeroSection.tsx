export default function HeroSection() {
  return (
    <section id="hero" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
        
        {/* Left: Product messaging */}
        <div className="text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
            ResumeIQ
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mb-6 sm:mb-8 mx-auto md:mx-0 leading-relaxed">
            Analyze your resume, LinkedIn, and GitHub profile with
            recruiter-style intelligence to uncover strengths, gaps,
            and clear improvement actions.
          </p>

          <div className="flex justify-center md:justify-start">
            <button
              onClick={() =>
                document
                  .getElementById("analyze")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full sm:w-auto rounded-lg bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-black hover:bg-gray-200 transition active:scale-95 min-h-12"
            >
              Analyze My Profile
            </button>
          </div>
        </div>

        {/* Right: Video/Image */}
        <div className="relative w-full h-auto order-1 md:order-2">
          {/* Video for all screen sizes */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black w-full aspect-video">
            <video
              className="w-full h-full object-cover"
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              poster="/api/placeholder?width=400&height=300"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
