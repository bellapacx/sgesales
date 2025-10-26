import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    select: { productCode: true, productName: true, price: true },
    orderBy: { productName: "asc" },
  });
  return NextResponse.json(products);
}
