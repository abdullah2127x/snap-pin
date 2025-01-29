import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { checkUserVerified } from "@/actions/auth/checkUserVerified";
import { saveUser } from "@/actions/auth/saveUser";
const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text", required: true },
      },
      async authorize(credentials) {
        const { email } = credentials;
        if (!email) return null;

        // Add your authentication logic here (e.g., verify credentials from DB)
        const user = { email, isVerified: true, upDatedAt: Date.now() };

        if (user) {
          return user;
        } else {
          return null; // Return null if authentication fails
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page if needed
  },
  callbacks: {
    async signIn({ user, account }) {
      if (user) {
        const personData = {
          email: user.email,
          isVerified: true,
          updatedAt: Date.now(),
          provider: account.provider || "unknown",
          ...(user.name && { name: user.name }), // Only add `name` if it exists
        };

        // Save the user data (optional step)
        const savedUser = await saveUser(personData);

        if (savedUser && savedUser.success) {
          const isVerifiedUser = await checkUserVerified({
            email: personData.email,
            provider: personData.provider,
          });
          if (isVerifiedUser && isVerifiedUser.success) {
            return true; // Continue the sign-in process
          }
        }
      }
      return false;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },

    async jwt({ token, user, account }) {
      // On the first sign-in, store user information in the token
      if (user && account) {
        token.user = {
          name: user.name,
          email: user.email,
          isVerified: user.isVerified || false,
          updatedAt: user.updatedAt || Date.now(),
          provider: account.provider || "credentials", // Handle missing provider
        };
      }

      // Persist token data for future sessions
      return token;
    },

    async session({ session, token }) {
      // Attach the stored user data from token to session.user
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
