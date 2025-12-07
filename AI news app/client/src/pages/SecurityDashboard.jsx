import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SecurityDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authorized. Please log in first.");
      return;
    }

    axios
      .get(`${BASE_URL}/api/security/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load security data");
      });
  }, [BASE_URL]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Loading security data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Security Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Monitor API usage, failed logins, and suspicious activity.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Requests</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {data.totalRequests}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500">Failed Logins</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {data.failedLogins}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500">Suspicious IPs</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {data.suspiciousIPs.length}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Logs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">IP</th>
                  <th className="p-2 border text-left">Endpoint</th>
                  <th className="p-2 border text-left">Status</th>
                  <th className="p-2 border text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border">{log.ip}</td>
                    <td className="p-2 border">{log.endpoint}</td>
                    <td className="p-2 border">
                      <span
                        className={
                          log.status === "success"
                            ? "text-green-600"
                            : log.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
