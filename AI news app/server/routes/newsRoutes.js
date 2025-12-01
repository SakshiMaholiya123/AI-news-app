import express from "express";
import { getNewsByCategory } from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/news?category=Technology
router.get("/", protect, getNewsByCategory);

export default router;
