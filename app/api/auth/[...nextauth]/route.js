import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
// import Google from "next-auth/providers/google";
// import Apple from "next-auth/providers/apple";
// import Facebook from "next-auth/providers/facebook";
// import Twitter from "next-auth/providers/twitter";
// import LinkedIn from "next-auth/providers/linkedin";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
