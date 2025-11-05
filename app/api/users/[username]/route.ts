import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET user by username
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

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
export async function DELETE(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    // ✅ unwrap params (because it's a Promise)
    const { username } = await context.params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is missing" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { username },
    });

    return NextResponse.json({
      message: `✅ User '${username}' deleted successfully.`,
    });
  } catch (err: any) {
    console.error("DELETE /api/users/[username] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
