import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Admin credentials not found in environment variables");
  }

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        firstName: "Admin",
        lastName: "User",
        password: hashedPassword,
        role: "ADMIN",
        verified: true,
      },
    });

    // Admin user created (removed console.log for production)
  } catch (error) {
    console.error("Error seeding admin user:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
