import express from "express";
import { createSummary, getSummaries, deleteSummary } from "../controllers/summaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ POST /api/summary - Create new summary
router.post("/", protect, createSummary);

// ✅ GET /api/summary - Get all user summaries
router.get("/", protect, getSummaries);

// ✅ DELETE /api/summary/:id - Delete specific summary
router.delete("/:id", protect, deleteSummary);

export default router;
