// server/middleware/suspiciousActivity.js
import SecurityLog from "../models/SecurityLog.js";

const suspiciousThreshold = 20; // requests per minute (not used yet)

export const suspiciousActivityDetector = async (req, res, next) => {
  const ip = req.ip;

  // Log all requests at pre-check phase
  await SecurityLog.create({
    ip,
    endpoint: req.originalUrl,
    method: req.method,
    userAgent: req.headers["user-agent"] || "unknown",
    status: "pending",      // ✅ waiting for final result
    phase: "pre-check",     // ✅ new field
  });

  // Simple suspicious activity check (placeholder)
  console.log(`📊 Request from IP: ${ip} → ${req.method} ${req.originalUrl}`);

  next();
};
