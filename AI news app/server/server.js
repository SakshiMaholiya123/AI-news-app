import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import session from "express-session";
import passport from "./config/passport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 5000;

console.log("📂 Looking for .env at:", path.join(__dirname, ".env"));
console.log("🔍 GOOGLE_CLIENT_ID loaded:", process.env.GOOGLE_CLIENT_ID ? "✅ YES" : "❌ NO");
console.log("🔍 GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
console.log("🔍 GEMINI_API_KEY length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

console.log("✅ Step 1: Imports done");
console.log("✅ Step 2: Passport imported");

// Enforce SESSION_SECRET presence
if (!SESSION_SECRET) {
  console.error("❌ SESSION_SECRET is missing in environment variables. Exiting...");
  process.exit(1);
}

console.log("✅ Step 3: Routes imported");

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

console.log("✅ Step 4: Middleware configured");

connectDB();

console.log("✅ Step 5: MongoDB connection initiated");

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

console.log("✅ Step 6: Session configured");

app.use(passport.initialize());
app.use(passport.session());

console.log("✅ Step 7: Passport initialized");

// Routes loading
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/ai", aiRoutes);

console.log("✅ Step 8: Routes registered");

app.get("/", (req, res) => {
  res.send("🚀 AI News Summarizer Backend is running...");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🎉 Google OAuth is ready!");
  console.log(`🔗 Test at: http://localhost:${PORT}/api/auth/google`);
});

console.log("✅ Step 9: Server started");
