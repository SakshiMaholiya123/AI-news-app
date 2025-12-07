import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SecurityLog from "../models/SecurityLog.js"; // logging only

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    await SecurityLog.create({
      ip: req.ip,
      endpoint: req.originalUrl,
      message: "Unauthorized - No Token",
      status: "fail",          // ✅ normalized
      phase: "auth",           // ✅ new field
      userAgent: req.headers["user-agent"],
    });

    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    await SecurityLog.create({
      ip: req.ip,
      endpoint: req.originalUrl,
      userId: decoded.id,
      message: "Token Verified",
      status: "success",       // ✅ normalized
      phase: "auth",           // ✅ new field
      userAgent: req.headers["user-agent"],
    });

    next();
  } catch (err) {
    await SecurityLog.create({
      ip: req.ip,
      endpoint: req.originalUrl,
      message: "Invalid or Expired Token",
      status: "fail",          // ✅ normalized
      phase: "auth",           // ✅ new field
      userAgent: req.headers["user-agent"],
    });

    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
