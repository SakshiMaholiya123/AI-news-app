import express from "express";
import passport from "../config/passport.js"; // ✅ ADD
import jwt from "jsonwebtoken";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// ✅ Google OAuth Routes (works for BOTH login and register)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      console.log("✅ Token generated for:", req.user.email);

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth-success?token=${token}`);
    } catch (error) {
      console.error("❌ Error in callback:", error);
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  }
);

export default router;
