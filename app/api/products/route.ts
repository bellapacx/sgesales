import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    select: { productCode: true, productName: true, price: true },
  });
  return NextResponse.json(products);
}
