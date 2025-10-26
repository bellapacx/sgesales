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

    // 2️⃣ Fetch product prices
    const products = await prisma.product.findMany();
    const priceMap = Object.fromEntries(
      products.map((p) => [p.productCode, p.price])
    );

    // 3️⃣ Prepare product entries (💰 now includes price + totalSales)
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
        price, // ✅ store price
        totalSales, // ✅ store total for this product
      };
    });

    // 4️⃣ Calculate overall sale total
    const saleTotal = productEntries.reduce(
      (sum: number, p: any) => sum + p.totalSales,
      0
    );
    const cashReceived = Number(data.cashReceived || 0);
    const cashDeposited = Number(data.cashDeposited || 0);
    const difference = cashReceived - cashDeposited;

    // 5️⃣ Save sale with product entries
    const sale = await prisma.sale.create({
      data: {
        salesPersonId: user.id,
        plateNumber: data.plateNumber,
        cashReceived,
        cashDeposited,
        difference,
        totalSales: saleTotal, // ✅ matches schema
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
      products: true,
    },
    orderBy: { date: "desc" },
  });

  return Response.json(sales);
}
