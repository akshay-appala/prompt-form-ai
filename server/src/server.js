import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import formRoutes from "./routes/formRoutes.js";

const app = express();

// Allow requests only from the configured frontend origin.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);

// Simple endpoint for checking whether the API server is running.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FormAI server is running",
  });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
