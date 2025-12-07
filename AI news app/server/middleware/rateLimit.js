// server/middleware/rateLimit.js
import rateLimit from "express-rate-limit";

export const summaryRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: "Too many summary requests. Try again later.",
    standardHeaders: true,
});

export const loginRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Try again later.",
    standardHeaders: true,
});
