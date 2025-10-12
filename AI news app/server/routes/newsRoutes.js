// routes/newsRoutes.js
import express from "express";
import { getByCategory } from "../controllers/newsController.js";

const router = express.Router();

// GET /api/news?category=Technology
router.get("/", getByCategory);

export default router;
