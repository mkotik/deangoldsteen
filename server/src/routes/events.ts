import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Haversine formula implementation
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

router.get("/", async (req, res) => {
  const { latitude, longitude } = req.query;
  const lat = parseFloat(latitude as string);
  const lng = parseFloat(longitude as string);
  const maxDistance = 60; // miles

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: "Invalid coordinates provided" });
  }

  try {
    // First, get all events with coordinates
    const events = await prisma.event.findMany({
      where: {
        AND: [{ latitude: { not: null } }, { longitude: { not: null } }],
      },
    });

    // Filter events by distance
    const nearbyEvents = events
      .map((event) => ({
        ...event,
        distance: calculateDistance(
          lat,
          lng,
          event.latitude!,
          event.longitude!
        ),
      }))
      .filter((event) => event.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
