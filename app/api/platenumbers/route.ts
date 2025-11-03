import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plateNumbers = await prisma.plateNumber.findMany({
      select: { id: true, plate: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(plateNumbers);
  } catch (error) {
    console.error("Error fetching plate numbers:", error);
    return NextResponse.json(
      { error: "Failed to fetch plate numbers" },
      { status: 500 }
    );
  }
}
