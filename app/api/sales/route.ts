import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1️⃣ Validate salesperson
    const user = await prisma.user.findUnique({
      where: { username: data.salesPerson },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: "Salesperson not found" }), {
        status: 404,
      });
    }

    // 2️⃣ Validate plate number
    let plateNumberId: number | null = null;
    if (data.plateNumberId) {
      const plate = await prisma.plateNumber.findUnique({
        where: { id: Number(data.plateNumberId) },
      });
      if (!plate) {
        return new Response(
          JSON.stringify({ error: "Plate number not found" }),
          { status: 404 }
        );
      }
      plateNumberId = plate.id;
    }

    // 3️⃣ Fetch product prices
    const products = await prisma.product.findMany();
    const priceMap = Object.fromEntries(
      products.map((p) => [p.productCode, p.price])
    );

    // 4️⃣ Prepare product entries
    const productEntries = data.products.map((p: any) => {
      const price = priceMap[p.productCode] || 0;
      const totalSales = price * (p.sold || 0);
      return {
        productCode: p.productCode,
        productName: p.productName,
        received: p.received,
        sold: p.sold,
        productReturned: p.productReturned,
        emptyReturned: p.emptyReturned,
        price,
        totalSales,
      };
    });

    // 5️⃣ Calculate totals
    const saleTotal = productEntries.reduce(
      (sum: number, p: any) => sum + p.totalSales,
      0
    );
    const cashReceived = Number(data.cashReceived || 0);
    const cashDeposited = Number(data.cashDeposited || 0);
    const difference = cashReceived - cashDeposited;

    // 6️⃣ Save sale
    const sale = await prisma.sale.create({
      data: {
        date: new Date(data.date), // ✅ store selected date
        salesPersonId: user.id,
        plateNumberId, // ✅ store relation
        cashReceived,
        cashDeposited,
        difference,
        totalSales: saleTotal,
        products: {
          create: productEntries,
        },
      },
      include: { products: true },
    });

    return new Response(JSON.stringify(sale), { status: 201 });
  } catch (error) {
    console.error("❌ Error saving sale:", error);
    return new Response(JSON.stringify({ error: "Failed to save sale" }), {
      status: 500,
    });
  }
}

export async function GET() {
  const sales = await prisma.sale.findMany({
    include: {
      salesPerson: { select: { name: true, username: true } },
      plateNumber: true, // ✅ include plate number
      products: true,
    },
    orderBy: { date: "desc" },
  });

  return new Response(JSON.stringify(sales), { status: 200 });
}
