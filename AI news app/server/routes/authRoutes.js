import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { register, login, getMe } from "../controllers/authController.js";  
import { protect } from "../middleware/authMiddleware.js";
import { loginRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

// =========================
// 🔐 AUTH ROUTES
// =========================

// Register User
router.post("/register", register);

// Login User (with rate limit)

router.post("/login", loginRateLimit, login);  

// Get Authenticated User
router.get("/me", protect, getMe);

// =========================
// 🔐 GOOGLE OAUTH ROUTES
// =========================

// Step 1: Redirect to Google Login Page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google Callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    try {
      // Create JWT for logged-in Google user
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      console.log("✅ Google OAuth login successful for:", req.user.email);

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth-success?token=${token}`);
    } catch (error) {
      console.error("❌ Google OAuth error:", error);
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  }
);

export default router;
