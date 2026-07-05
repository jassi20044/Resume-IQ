"use client"

import { useState, useEffect, Suspense, useRef, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import CursorGlow from "@/components/shared/CursorGlow"

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState({ email: false, password: false })
  const searchParams = useSearchParams()
  const router = useRouter()
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // Handle URL error parameters
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      if (errorParam === "OAuthCallback") {
        setErrors({
          general: "Google OAuth authentication failed. This usually happens when:\n• Google OAuth credentials are missing or incorrect\n• NEXTAUTH_URL environment variable is not set\n• Callback URL mismatch in Google Cloud Console\n\nPlease use email/password login or check your environment variables.",
        })
        // Clear error from URL to prevent showing on refresh
        const url = new URL(window.location.href)
        url.searchParams.delete("error")
        window.history.replaceState({}, "", url.toString())
      } else if (errorParam === "CredentialsSignin") {
        setErrors({
          general: "Invalid email or password. Please try again.",
        })
        // Clear error from URL
        const url = new URL(window.location.href)
        url.searchParams.delete("error")
        window.history.replaceState({}, "", url.toString())
      } else {
        setErrors({
          general: "An error occurred during authentication. Please try again.",
        })
        // Clear error from URL
        const url = new URL(window.location.href)
        url.searchParams.delete("error")
        window.history.replaceState({}, "", url.toString())
      }
    }
  }, [searchParams])

  // Focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Validate email format
  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address"
    }
    return undefined
  }

  // Validate password
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return "Password is required"
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters"
    }
    return undefined
  }

  // Handle input blur for validation
  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === "email") {
      const error = validateEmail(email)
      setErrors((prev) => ({ ...prev, email: error }))
    } else if (field === "password") {
      const error = validatePassword(password)
      setErrors((prev) => ({ ...prev, password: error }))
    }
  }

  // Handle input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setErrors((prev) => ({ ...prev, general: undefined }))
    if (touched.email) {
      const error = validateEmail(value)
      setErrors((prev) => ({ ...prev, email: error }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setErrors((prev) => ({ ...prev, general: undefined }))
    if (touched.password) {
      const error = validatePassword(value)
      setErrors((prev) => ({ ...prev, password: error }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ email: true, password: true })

    // Validate form
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      })
      // Focus first error field
      if (emailError) {
        emailInputRef.current?.focus()
      } else if (passwordError) {
        passwordInputRef.current?.focus()
      }
      return
    }

    // Clear errors and submit
    setErrors({})
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        callbackUrl: "/main",
        redirect: false,
      })

      if (result?.error) {
        setErrors({
          general: "Invalid email or password. Please try again.",
        })
        passwordInputRef.current?.focus()
      } else if (result?.ok) {
        router.push("/main")
        router.refresh()
      }
    } catch (error) {
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle OAuth login
  const handleOAuthLogin = async () => {
    setErrors({})
    setOauthLoading(true)
    try {
      await signIn("google", { callbackUrl: "/main" })
    } catch (error) {
      setErrors({
        general: "Failed to initiate Google sign-in. Please try again.",
      })
      setOauthLoading(false)
    }
  }

  const isFormValid = !validateEmail(email) && !validatePassword(password) && email && password
  const isSubmitting = loading || oauthLoading

  return (
    <div className="relative min-h-screen bg-[#0A0E1A] overflow-hidden">
      {/* Cursor-based interactive glow */}
      <CursorGlow />

      {/* Static background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex h-20 items-center justify-between px-4 sm:px-6 backdrop-blur-md">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          ResumeIQ
        </span>
        <span className="text-sm sm:text-lg text-gray-500 hidden sm:inline">
          Recruiter-grade intelligence
        </span>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
          {/* Card header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Access your ResumeIQ dashboard
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
            >
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <div className="whitespace-pre-line">{errors.general}</div>
                </div>
                <button
                  onClick={() => setErrors((prev) => ({ ...prev, general: undefined }))}
                  className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Dismiss error"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium text-gray-400"
              >
                Email address
              </label>
              <input
                id="email"
                ref={emailInputRef}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                className={`w-full rounded-md border px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                  touched.email && errors.email
                    ? "border-red-500/50 bg-[#0B0F1A] focus:ring-red-500/50"
                    : "border-gray-700 bg-[#0B0F1A] focus:ring-indigo-500 focus:border-indigo-500/50"
                }`}
                disabled={isSubmitting}
              />
              {touched.email && errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1 text-xs text-red-400 flex items-center gap-1"
                >
                  <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-medium text-gray-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={touched.password && !!errors.password}
                  aria-describedby={
                    touched.password && errors.password
                      ? "password-error"
                      : showPassword
                      ? "password-toggle"
                      : undefined
                  }
                  className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                    touched.password && errors.password
                      ? "border-red-500/50 bg-[#0B0F1A] focus:ring-red-500/50"
                      : "border-gray-700 bg-[#0B0F1A] focus:ring-indigo-500 focus:border-indigo-500/50"
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-describedby="password-toggle"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1 text-xs text-red-400 flex items-center gap-1"
                >
                  <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="mb-4 w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0E1A] disabled:cursor-not-allowed disabled:bg-indigo-600/50 disabled:hover:bg-indigo-600/50"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs text-gray-500" role="separator" aria-label="Or">
            <div className="h-px flex-1 bg-gray-800" />
            <span>OR</span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleOAuthLogin}
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-700 bg-[#0B0F1A] py-2.5 text-sm text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0E1A] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0B0F1A]"
            aria-busy={oauthLoading}
          >
            {oauthLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </span>
            ) : (
              <>
                Continue with{" "}
                <span className="font-semibold">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#DB4437]">o</span>
                  <span className="text-[#F4B400]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#0F9D58]">l</span>
                  <span className="text-[#DB4437]">e</span>
                </span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-[#0A0E1A] overflow-hidden flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
