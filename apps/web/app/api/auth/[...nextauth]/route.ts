import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

const authHandler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "test@resumeiq.com" &&
          credentials?.password === "resume123"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          }
        }
        return null
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always allow redirect to /main after login
      if (url.startsWith(baseUrl)) return url
      return baseUrl + "/main"
    },
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === "google") {
        return true
      }
      // Allow credentials sign-ins
      if (account?.provider === "credentials") {
        return true
      }
      return true
    },
    async jwt({ token, user, account, profile }) {
      // When user signs in, add their image and name to the token
      if (user) {
        token.picture = user.image
        token.name = user.name
      }
      // For Google OAuth, get image from profile
      if (account?.provider === "google" && profile) {
        token.picture = (profile as any).picture
        token.name = profile.name
      }
      return token
    },
    async session({ session, token }) {
      // Add image and name from token to session
      if (session.user) {
        session.user.image = token.picture as string
        session.user.name = token.name as string
      }
      return session
    },
  },

  debug: process.env.NODE_ENV === "development",

  // Ensure NEXTAUTH_URL is set for OAuth callbacks
  ...(process.env.NEXTAUTH_URL && {
    url: process.env.NEXTAUTH_URL
  }),
})

export { authHandler as GET, authHandler as POST }
