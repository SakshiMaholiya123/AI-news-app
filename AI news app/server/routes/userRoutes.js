import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/profile", protect, getProfile);

// Update profile (with optional avatar upload)
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
