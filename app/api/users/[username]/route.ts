import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Define handler types manually to match new Next.js 15 behavior
type RouteContext = {
  params: Promise<{ username: string }>;
};

// ✅ GET user by username
export async function GET(req: Request, context: RouteContext) {
  try {
    const { username } = await context.params; // ✅ unwrap Promise

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error("GET /api/users/[username] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE user by username
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { username } = await context.params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is missing" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { username } });

    return NextResponse.json({
      message: `✅ User '${username}' deleted successfully.`,
    });
  } catch (err: any) {
    console.error("DELETE /api/users/[username] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
