/// <reference types="@types/google.maps" />
import { PrismaClient } from "@prisma/client";
import { Client } from "@googlemaps/google-maps-services-js";

const prisma = new PrismaClient();
const client = new Client({});

async function updateEventCoordinates() {
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  try {
    const events = await prisma.event.findMany();
    console.log(`Found ${events.length} total events to process`);

    for (const event of events) {
      totalProcessed++;
      console.log(`\nProcessing event: ${event.name} (${event.id})`);

      if (event.latitude && event.longitude) {
        console.log("⏭️  Skipping: Coordinates already exist");
        totalSkipped++;
        continue;
      }

      const address = `${event.address}, ${event.city}, ${event.state}`;
      console.log(`🔍 Geocoding address: ${address}`);

      try {
        const response = await client.geocode({
          params: {
            address: address,
            key: process.env.GOOGLE_MAPS_API_KEY as string,
          },
        });

        if (response.data.results[0]) {
          const { lat, lng } = response.data.results[0].geometry.location;

          await prisma.event.update({
            where: { id: event.id },
            data: {
              latitude: lat,
              longitude: lng,
            },
          });

          console.log(`✅ Updated coordinates: ${lat}, ${lng}`);
          totalUpdated++;
        }

        // Add delay to avoid hitting API rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Error geocoding ${address}:`, error);
        totalErrors++;
      }
    }

    console.log("\n=== Final Summary ===");
    console.log(`Total events processed: ${totalProcessed}`);
    console.log(`Total events updated: ${totalUpdated}`);
    console.log(`Total events skipped: ${totalSkipped}`);
    console.log(`Total errors: ${totalErrors}`);
  } catch (error) {
    console.error("Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEventCoordinates().catch(console.error);
