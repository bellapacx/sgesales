import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin user...");

  // Hash the admin password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Upsert the admin (create if missing, skip if exists)
  const admin = await prisma.user.upsert({
    where: { username: "admin1" },
    update: {}, // you could also allow updating password or name here if you wish
    create: {
      username: "admin",
      name: "System Administrator",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin seeded successfully:", admin.username);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
