// server/controllers/securityController.js
import SecurityLog from "../models/SecurityLog.js";

export const getSecurityOverview = async (req, res) => {
    const totalRequests = await SecurityLog.countDocuments();
    const failedLogins = await SecurityLog.countDocuments({
        endpoint: "/api/auth/login",
        status: "fail"
    });

    const suspiciousIPs = await SecurityLog.aggregate([
        { $group: { _id: "$ip", count: { $sum: 1 } } },
        { $match: { count: { $gt: 20 } } }
    ]);

    const last20Logs = await SecurityLog.find().sort({ timestamp: -1 }).limit(20);

    res.json({
        totalRequests,
        failedLogins,
        suspiciousIPs,
        recentLogs: last20Logs
    });
};
