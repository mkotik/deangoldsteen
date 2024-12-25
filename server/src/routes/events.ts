import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { city } = req.query;

    const events = await prisma.event.findMany({
      where: {
        ...(city
          ? { city: { equals: String(city), mode: "insensitive" } }
          : {}),
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
