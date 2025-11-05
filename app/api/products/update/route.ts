import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const products = await req.json();

    const results = await Promise.all(
      products.map(async (p: any) => {
        if (!p.productCode || !p.productName) return null;

        const existing = await prisma.product.findFirst({
          where: { productCode: p.productCode },
        });

        if (existing) {
          // Update existing
          return prisma.product.update({
            where: { id: existing.id },
            data: { productName: p.productName, price: p.price },
          });
        } else {
          // Create new
          return prisma.product.create({
            data: {
              productCode: p.productCode,
              productName: p.productName,
              price: p.price,
            },
          });
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Error saving products:", err);
    return NextResponse.json(
      { error: "Failed to save products" },
      { status: 500 }
    );
  }
}
