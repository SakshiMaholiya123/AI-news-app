// server/models/SecurityLog.js
import mongoose from "mongoose";

const securityLogSchema = new mongoose.Schema({
  ip: String,
  endpoint: String,
  method: String,
  userAgent: String,
  status: String, // success / fail / pending
  phase: {
    type: String,
    enum: ["pre-check", "auth", "request"],
    default: "request",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("SecurityLog", securityLogSchema);
