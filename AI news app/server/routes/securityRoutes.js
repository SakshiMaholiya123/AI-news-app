// server/routes/securityRoutes.js
import express from "express";
import { getSecurityOverview } from "../controllers/securityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getSecurityOverview);

export default router;
