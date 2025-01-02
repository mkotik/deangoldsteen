import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  console.log("Received request for city:", req.query.city);
  try {
    const events = await prisma.event.findMany({
      where: {
        city: {
          equals: req.query.city as string,
          mode: "insensitive",
        },
      },
    });
    console.log("Found events:", events);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
