import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface ComedyEvent {
  time: string;
  name?: string;
  venue?: string;
  address: string;
  city: string;
  state: string;
  frequency?: string;
  cost?: string;
  info?: string;
  email?: string;
  link?: string;
  phone?: string;
  date: string;
  event_type: string;
  recurrence_rule?: string;
  recurrence_end_date?: Date | null;
}

async function uploadEvents() {
  let totalUploaded = 0;
  let totalSkipped = 0;

  try {
    const dataDir = path.join(__dirname, "data");
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));

    for (const file of files) {
      console.log(`\nProcessing ${file}...`);
      const filePath = path.join(dataDir, file);
      const events: ComedyEvent[] = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
      );

      let fileUploaded = 0;
      let fileSkipped = 0;

      for (const event of events) {
        // Check for duplicate event
        const existingEvent = await prisma.event.findFirst({
          where: {
            AND: [
              { time: event.time },
              { name: event.name || "" },
              { venue: event.venue || "" },
              { recurrence_rule: event.recurrence_rule || "" },
            ],
          },
        });

        if (!existingEvent) {
          // Create new event if no duplicate found
          await prisma.event.create({
            data: {
              time: event.time,
              name: event.name || "",
              venue: event.venue || "",
              address: event.address,
              city: event.city,
              state: event.state,
              frequency: event.frequency || "",
              cost: event.cost || "",
              info: event.info || "",
              email: event.email || "",
              link: event.link || "",
              phone: event.phone || "",
              date: event.date,
              event_type: event.event_type.toLowerCase() as
                | "singular"
                | "recurring",
              recurrence_rule: event.recurrence_rule || "",
              recurrence_end_date: event.recurrence_end_date || null,
            },
          });
          console.log(`✅ Uploaded: ${event.name} at ${event.venue}`);
          fileUploaded++;
          totalUploaded++;
        } else {
          console.log(`⏭️  Skipped: ${event.name} at ${event.venue}`);
          fileSkipped++;
          totalSkipped++;
        }
      }

      console.log(`\nFile summary for ${file}:`);
      console.log(`Uploaded: ${fileUploaded} events`);
      console.log(`Skipped: ${fileSkipped} events`);
    }

    console.log("\n=== Final Summary ===");
    console.log(`Total events uploaded: ${totalUploaded}`);
    console.log(`Total events skipped: ${totalSkipped}`);
    console.log(`Total events processed: ${totalUploaded + totalSkipped}`);
  } catch (error) {
    console.error("Error uploading events:", error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadEvents().catch(console.error);
