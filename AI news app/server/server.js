import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

// Controller
import { summarizeText } from "./controllers/aiController.js";

dotenv.config();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Setup path variables for static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/news", newsRoutes);

// Public AI summarization endpoint
app.post("/api/summarize", summarizeText);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 AI News Summarizer Backend is running...");
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
