import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import User from "@/models/User";
import dbConnect from "@db/dbConnect";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider == "github") {
        await dbConnect();
        // Check if the user already exists in the database
        const currentUser = await User.findOne({ email: email });
        if (!currentUser) {
          // Create a new user
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            signMethod: "github",
          });
        }
        // if this is not written an error comes that you do not have permission by the app to sign in.
        return true;
      }
    },
    async session({ session, user, token }) {
      await dbConnect();
      const userExist = await User.findOne({ email: session.user.email });
      if (userExist?.username) session.user.name = userExist.username;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
