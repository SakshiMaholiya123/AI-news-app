import express from "express";
import { summarizeText } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ This creates endpoint: POST /api/ai
router.post("/", protect, summarizeText);

export default router;
