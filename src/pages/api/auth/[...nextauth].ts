import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "prisma-client";
import { comparePassword } from "utils/password";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;
        const { username, password } = credentials;

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) return null;
        if (!(await comparePassword(user.password, password))) return null;

        return { id: user.id, username };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user as unknown as User;
      return token;
    },
  },
};
export default NextAuth(authOptions);
