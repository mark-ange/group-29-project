import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { UserRoleSchema } from "@/lib/constants";
import { rateLimiter, requestIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

const loginSchema = z.strictObject({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const ip = requestIp(request.headers);
        const limit = rateLimiter.consume(`login:${ip}`, 8, 15 * 60 * 1000);
        if (!limit.allowed) return null;

        const parsed = loginSchema.safeParse({ email: credentials?.email, password: credentials?.password });
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          select: { id: true, name: true, email: true, passwordHash: true, role: true },
        });
        if (!user) return null;

        const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
        const role = UserRoleSchema.safeParse(user.role);
        if (!validPassword || !role.success) return null;

        return { id: user.id, name: user.name, email: user.email, role: role.data };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub && UserRoleSchema.safeParse(token.role).success) {
        session.user.id = token.sub;
        session.user.role = token.role as "ADMIN" | "HOST" | "GUEST";
      }
      return session;
    },
  },
});
