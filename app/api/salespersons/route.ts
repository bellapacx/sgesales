import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: "SALESPERSON" },
    select: { id: true, name: true, username: true, plateNumber: true },
  });
  return NextResponse.json(users);
}
