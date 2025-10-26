import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    role: "ADMIN" | "SALESPERSON";
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: "ADMIN" | "SALESPERSON";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: "ADMIN" | "SALESPERSON";
  }
}
