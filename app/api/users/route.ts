// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ GET all users (admin only)
export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      plateNumber: true, // ✅ fixed
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

// ✅ Create a new salesperson
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // ✅ Only admins can create users
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { username, name, password, plateNumber } = await req.json();

    if (!username || !name || !password || !plateNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // ✅ hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ create new user with plate number
    const user = await prisma.user.create({
      data: {
        username,
        name,
        password: hashed,
        plateNumber,
        role: "SALESPERSON",
      },
      select: { id: true, username: true, name: true, plateNumber: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
