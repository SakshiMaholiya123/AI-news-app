import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import session from "express-session";
import rateLimit from "express-rate-limit";
import passport from "./config/passport.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// ⭐ NEW SECURITY IMPORTS
import { securityLogger } from "./middleware/securityLogger.js";
import { suspiciousActivityDetector } from "./middleware/suspiciousActivity.js";
import securityRoutes from "./routes/securityRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 5000;

// =========================
// 💥 SECURITY FAILSAFE
// =========================
if (!SESSION_SECRET) {
  console.error("❌ SESSION_SECRET missing. Fix your .env file.");
  process.exit(1);
}

const app = express();

// =========================
// 🌐 CORS
// =========================
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// =========================
// 📌 EXPRESS JSON
// =========================
app.use(express.json());

// =========================
// 🌐 CONNECT DB
// =========================
connectDB();

// =========================
// 📁 STATIC FILE SERVER
// =========================
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// =========================
// 🔐 SESSION
// =========================
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Change to true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// =========================
// 🔐 PASSPORT
// =========================
app.use(passport.initialize());
app.use(passport.session());

// =========================
// 🚨 RATE LIMITERS
// =========================

// Summary API — prevent abuse
const summaryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many summary requests. Try again later.",
});

// Login API — brute-force protection
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many login attempts!",
});

// ⭐ CORRECT ORDER (IMPORTANT)
app.use("/api/auth/login", loginLimiter);
app.use("/api/summary", summaryLimiter);

// =========================
// 🔐 SECURITY LOGGER
// =========================
app.use(securityLogger);

// =========================
// 🚨 SUSPICIOUS ACTIVITY
// =========================
app.use(suspiciousActivityDetector);

// =========================
// 🛣️ ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/security", securityRoutes);

// =========================
// ROOT ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("🚀 AI News Summarizer Backend is running securely...");
});

// =========================
// ❗ ERROR HANDLER
// =========================
app.use(errorHandler);

// =========================
// 🚀 START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
