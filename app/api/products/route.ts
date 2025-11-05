import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    select: { id: true, productCode: true, productName: true, price: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(products);
}
