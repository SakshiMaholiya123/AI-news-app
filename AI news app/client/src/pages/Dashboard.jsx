import React, { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard";
import axios from "axios";
import { PlusCircle, BookOpen, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Load user from localStorage first
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ✅ Fetch latest user info from backend
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    // ✅ Fetch all summaries
    const fetchSummaries = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/summaries",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummaries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching summaries:", err);
        setSummaries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchSummaries();
  }, [navigate]);

  // ✅ Delete summary
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/summaries/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSummaries((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("❌ Error deleting summary:", err);
    }
  };

  // ✅ Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Stats
  const totalSummaries = summaries.length;
  const categories = 5; // static example
  const thisWeek = summaries.filter((s) => {
    const createdAt = new Date(s.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdAt >= oneWeekAgo;
  }).length;
  const minutesSaved = totalSummaries * 5;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-700 text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 relative">
      {/* ✅ Welcome Banner */}
      <div className="bg-indigo-700 text-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="text-sm opacity-90">
          Summarize smarter. Save time. Stay informed.
        </p>
      </div>

      {/* ✅ Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate("/summarize")}
            className="p-5 bg-white shadow rounded-2xl flex flex-col items-center cursor-pointer hover:shadow-lg transition hover:bg-indigo-50"
          >
            <PlusCircle size={32} className="text-indigo-700 mb-2" />
            <p className="font-medium">Summarize New</p>
          </div>

          <div
            onClick={() => navigate("/saved")}
            className="p-5 bg-white shadow rounded-2xl flex flex-col items-center cursor-pointer hover:shadow-lg transition hover:bg-indigo-50"
          >
            <BookOpen size={32} className="text-green-600 mb-2" />
            <p className="font-medium">Saved Summaries</p>
          </div>

          <div
            onClick={() => navigate("/categories")}
            className="p-5 bg-white shadow rounded-2xl flex flex-col items-center cursor-pointer hover:shadow-lg transition hover:bg-indigo-50"
          >
            <FolderOpen size={32} className="text-purple-600 mb-2" />
            <p className="font-medium">Browse Categories</p>
          </div>
        </div>
      </div>

      {/* ✅ Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Summaries</h2>
        {summaries.length === 0 ? (
          <p className="text-gray-600">
            No recent summaries yet. Try summarizing an article!
          </p>
        ) : (
          <div className="space-y-4">
            {summaries.slice(0, 3).map((s) => (
              <SummaryCard key={s._id} summary={s} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Stats Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{totalSummaries}</p>
            <p className="text-sm text-gray-500">Saved Summaries</p>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{categories}</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{thisWeek}</p>
            <p className="text-sm text-gray-500">This Week</p>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow text-center">
            <p className="text-2xl font-bold">{minutesSaved}</p>
            <p className="text-sm text-gray-500">Minutes Saved</p>
          </div>
        </div>
      </div>

      {/* ✅ Logout Button */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={handleLogout}
          className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
