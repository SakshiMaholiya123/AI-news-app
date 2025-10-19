import express from "express";
import {
  getSummaries,
  deleteSummary,
  createSummary,
} from "../controllers/summaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new summary (CRUD)
router.post("/", protect, createSummary);

// Get all summaries of logged-in user
router.get("/", protect, getSummaries);

// Delete a summary by ID
router.delete("/:id", protect, deleteSummary);

export default router;
