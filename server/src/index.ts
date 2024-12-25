import express from "express";
import eventRoutes from "./routes/events";

const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
