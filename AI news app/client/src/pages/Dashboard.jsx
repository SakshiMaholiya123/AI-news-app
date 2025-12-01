import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  PlusCircle,
  BookOpen,
  FolderOpen,
  Copy,
  Trash2,
  Settings,
  LogOut as LogOutIcon,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("❌ Invalid JSON in localStorage:", e);
        localStorage.removeItem("user");
      }
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    const fetchSummaries = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/summary?limit=100",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const summariesArray = data.summaries || data;
        setSummaries(Array.isArray(summariesArray) ? summariesArray : []);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this summary?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/summary/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSummaries((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("❌ Error deleting summary:", err);
      alert("Failed to delete summary");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // User initial
  const getUserInitial = () => {
    if (!user?.name) return "U";
    return user.name.trim().charAt(0).toUpperCase();
  };

  // Build avatar URL from filename
  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    if (user.avatar.startsWith("http")) return user.avatar;
    return `${BASE_URL}/uploads/${user.avatar.replace(/^\/+/, "")}`;
  };

  const totalSummaries = summaries.length;
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

  const avatarUrl = getAvatarUrl();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Welcome Banner with User Dropdown */}
      <div className="bg-indigo-700 text-white p-6 rounded-2xl shadow-md relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {user?.name || "User"} 👋
            </h1>
            <p className="text-sm opacity-90">
              Summarize smarter. Save time. Stay informed.
            </p>
          </div>

          {/* User Dropdown in Welcome Banner */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              {/* Avatar or Initial */}
              <div className="w-10 h-10 rounded-full bg-white text-indigo-700 flex items-center justify-center font-bold text-lg overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.textContent = getUserInitial();
                    }}
                  />
                ) : (
                  getUserInitial()
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || "User"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    navigate("/profile-settings");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition text-gray-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>

                <div className="border-t border-gray-200 my-1" />

                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition"
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
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
            onClick={() => navigate("/saved-summaries")}
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Summaries */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Summaries</h2>
            {summaries.length > 2 && (
              <button
                onClick={() => navigate("/saved-summaries")}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View All →
              </button>
            )}
          </div>

          {summaries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
              <p className="text-gray-600 mb-2">No summaries yet</p>
              <p className="text-gray-500 text-sm mb-4">
                Start by summarizing your first article!
              </p>
              <button
                onClick={() => navigate("/summarize")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm"
              >
                Create Summary
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {summaries.slice(0, 2).map((summary) => (
                <div
                  key={summary._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
                >
                  <h3 className="text-indigo-600 font-semibold mb-2 text-sm">
                    AI Summary
                  </h3>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-1">
                    {summary.summary || summary.text}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/saved-summaries")}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Read More →
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(summary.summary || summary.text)
                      }
                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(summary._id)}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Stats */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-gray-600 text-sm mb-1">Total Summaries</p>
              <p className="text-3xl font-bold text-indigo-600">
                {totalSummaries}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-gray-600 text-sm mb-1">This Week</p>
              <p className="text-3xl font-bold text-green-600">{thisWeek}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-gray-600 text-sm mb-1">Minutes Saved</p>
              <p className="text-3xl font-bold text-purple-600">
                {minutesSaved}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
