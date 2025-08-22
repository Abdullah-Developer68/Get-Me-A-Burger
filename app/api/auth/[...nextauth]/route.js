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
    async signIn({ user, account, profile }) {
      if (account.provider == "github") {
        await dbConnect();
        const primaryEmail = user?.email || profile?.email;
        if (!primaryEmail) return false;

        const existing = await User.findOne({ email: primaryEmail });
        if (!existing) {
          await User.create({
            email: primaryEmail,
            username: primaryEmail.split("@")[0],
          });
        }
      }

      return true; // if this is not written an error comes that you do not have permission by the app to sign in.
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
