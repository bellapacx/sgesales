import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1️⃣ Users
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin1",
      name: "System Administrator",
      password: "admin1234", // later we’ll hash
      role: "ADMIN",
    },
  });

  const salesperson = await prisma.user.upsert({
    where: { username: "sales1" },
    update: {},
    create: {
      username: "sales1",
      name: "Sales Person 1",
      password: "sales123",
      role: "SALESPERSON",
      plateNumber: "ABC-1234", // ✅ Example plate number
    },
  });

  console.log("✅ Users seeded:", {
    admin: admin.username,
    salesperson: salesperson.username,
  });

  // 2️⃣ Products with Unit Price (ETB)
  const product = [
    { productCode: "4769", productName: "Fanta P/Apple 300 ml", price: 600.0 },
    { productCode: "1030", productName: "COCA 300 ml", price: 600.0 },
    { productCode: "3030", productName: "Fanta Orange 300 ml", price: 600.0 },
    { productCode: "2030", productName: "Sprite 300 ml", price: 600.0 },
    {
      productCode: "10209",
      productName: "Sch Novida P/Apple 300 ml",
      price: 600.0,
    },
    { productCode: "5464", productName: "Sch Tonic 300 ml", price: 600.0 },
    { productCode: "5897", productName: "Ambo 475 ml", price: 555.0 },
    { productCode: "2108", productName: "Sprite 500 ml", price: 680.0 },
    { productCode: "1271", productName: "COCA 500 ml", price: 640.0 },
    { productCode: "1460", productName: "Fanta Orange 500 ml", price: 640.0 },
    { productCode: "1470", productName: "Fanta P/Apple 500 ml", price: 640.0 },
    { productCode: "5898", productName: "Ambo Original 500 ml", price: 640.0 },
    { productCode: "3698", productName: "Predator Gold 400 ml", price: 625.0 },
  ];

  for (const p of product) {
    await prisma.product.upsert({
      where: { productCode: p.productCode },
      update: { price: p.price },
      create: p,
    });
  }

  console.log(`✅ Seeded ${product.length} products into Product table.`);
  // 2️⃣ Products (from your table)
  const products = [
    {
      productCode: "4769",
      productName: "Fanta P/Apple 300 ml CR 24RB",
      stockQuantity: 200,
    },
    {
      productCode: "1030",
      productName: "COCA (Coke) Ox24 300ml RGB",
      stockQuantity: 200,
    },
    {
      productCode: "3030",
      productName: "Fanta Orange 300 ml -RGB",
      stockQuantity: 200,
    },
    {
      productCode: "2030",
      productName: "Sprite 300 ml -RGB",
      stockQuantity: 200,
    },
    {
      productCode: "10209",
      productName: "Sch Novida P/Apple 300ml RGB",
      stockQuantity: 150,
    },
    {
      productCode: "5464",
      productName: "Sch Tonic -300ml -RB",
      stockQuantity: 150,
    },
    {
      productCode: "5897",
      productName: "Ambo 475mlCR 20 RB",
      stockQuantity: 150,
    },
    {
      productCode: "2108",
      productName: "Sprite 500ml -12 S/W NP",
      stockQuantity: 180,
    },
    {
      productCode: "1271",
      productName: "Coke 500ml -12 S/W NP",
      stockQuantity: 180,
    },
    {
      productCode: "1460",
      productName: "Fanta Orange 500ml -12 S/W NP",
      stockQuantity: 180,
    },
    {
      productCode: "1470",
      productName: "Fanta P/Apple 500ml -12 S/W NP",
      stockQuantity: 180,
    },
    {
      productCode: "5898",
      productName: "Ambo Orginal 500ml 12 S/W",
      stockQuantity: 150,
    },
    {
      productCode: "3698",
      productName: "Predator Gold 400ml 12 S/W",
      stockQuantity: 100,
    },
  ];

  for (const p of products) {
    await prisma.inventory.upsert({
      where: { productCode: p.productCode },
      update: {},
      create: p,
    });
  }

  console.log(`✅ Seeded ${products.length} products into inventory.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
