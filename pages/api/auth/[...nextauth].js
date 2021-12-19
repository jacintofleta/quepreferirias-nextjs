import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  callbacks: {
    async session({ session, user }) {
      session.jwt = user.jwt;
      session.id = user.id;
      return session;
    },
    async jwt({ token, user, account }) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback`
        );
        url.searchParams.set("access_token", account.access_token);
        const response = await fetch(url.toString());
        const data = await response.json();

        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      return token;
    },
  },
});
