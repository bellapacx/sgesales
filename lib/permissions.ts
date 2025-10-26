import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

export async function requireRole(role: "ADMIN" | "SALESPERSON") {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== role) {
    throw new Error("Unauthorized");
  }

  return session;
}
