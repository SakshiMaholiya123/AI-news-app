// routes/summaryRoutes.js
import express from "express";
import { createSummary, getUserSummaries, deleteSummary } from "../controllers/summaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSummary);
router.get("/", protect, getUserSummaries);
router.delete("/:id", protect, deleteSummary);

export default router;
