// server/middleware/securityLogger.js
import SecurityLog from "../models/SecurityLog.js";

const suspiciousUserAgents = ["curl", "python", "wget"];

export async function securityLogger(req, res, next) {
  const ip = req.ip;
  const userAgent = req.headers["user-agent"] || "unknown";

  // Detect suspicious user-agent
  if (suspiciousUserAgents.some((ua) => userAgent.toLowerCase().includes(ua))) {
    console.log("⚠ Suspicious User-Agent detected:", userAgent);
  }

  res.on("finish", async () => {
    await SecurityLog.create({
      ip,
      endpoint: req.originalUrl,
      method: req.method,
      userAgent,
      status: res.statusCode < 400 ? "success" : "fail", // ✅ normalized
      phase: "request",                                   // ✅ new field
      userId: req.user?._id || null,
    });
  });

  next();
}
