import express from "express";
import cors from "cors";
import eventRoutes from "./routes/events";

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/events", eventRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
