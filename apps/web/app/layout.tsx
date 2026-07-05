import "./globals.css"
import { Providers } from "./providers"

export const metadata = {
  title: "ResumeIQ - Resume & Profile Analysis",
  description: "Analyze your resume, LinkedIn, and GitHub profile with recruiter-style intelligence",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="theme-color" content="#0B0F1A" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0B0F1A] text-gray-100 antialiased overflow-y-auto">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
