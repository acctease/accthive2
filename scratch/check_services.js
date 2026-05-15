const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany();
  console.log("Current Services in DB:", JSON.stringify(services, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
