import express from "express";
import { createSummary, getSummaries, deleteSummary } from "../controllers/summaryController.js";
import { protect } from "../middleware/authMiddleware.js";

// ⭐ NEW: Local request logger for summary API
const summaryAPILogger = (req, res, next) => {
  req.summaryApiRequest = true; // Flag for controllers
  next();
};

const router = express.Router();

// =============================
// 🚀 SUMMARY ROUTES (SECURE)
// =============================

// POST → Create Summary
router.post("/", protect, summaryAPILogger, createSummary);

// GET → Fetch User Summaries
router.get("/", protect, summaryAPILogger, getSummaries);

// DELETE → Delete Summary
router.delete("/:id", protect, summaryAPILogger, deleteSummary);

export default router;
