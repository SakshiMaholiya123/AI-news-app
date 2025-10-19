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
import aiRoutes from "./routes/aiRoutes.js"; // ✅ new import

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Setup static file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ========================
// ✅ API ROUTES
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summary", summaryRoutes); // ✅ renamed from summaries
app.use("/api/news", newsRoutes);
app.use("/api", aiRoutes); // ✅ now summarization handled separately

// Root route
app.get("/", (req, res) => {
  res.send("🚀 AI News Summarizer Backend is running...");
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
