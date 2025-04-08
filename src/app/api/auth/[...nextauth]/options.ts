import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { User } from "@/models/user.model";
import { connectToDB } from "@/lib/mongodb";

 export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectToDB();
      
      const existingUser = await User.findOneAndUpdate(
        { email: user.email },
        { 
          $setOnInsert: { 
            name: user.name, 
            email: user.email, 
            image: user.image 
          } 
        },
        { upsert: true, new: true }
      );

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any ).id = token.id;  
      }
      return session;
    },
  },
};


