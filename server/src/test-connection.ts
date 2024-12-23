import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to the database");

    // Test creating an event
    const event = await prisma.event.create({
      data: {
        time: "19:00",
        address: "123 Test St",
        city: "New York",
        state: "NY",
        date: new Date(),
        event_type: "singular",
      },
    });
    console.log("Created test event:", event);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
