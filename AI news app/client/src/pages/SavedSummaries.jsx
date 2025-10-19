import { useState, useEffect } from "react";
import { Search, LogOut } from "lucide-react";
import SummaryCard from "../components/SummaryCard";

export default function SavedSummaries() {
  const [summaries, setSummaries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Backend Base URL (Change if deployed)
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch Saved Summaries
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await fetch(`${BASE_URL}/api/summaries`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch summaries");
        const data = await res.json();
        setSummaries(data);
      } catch (err) {
        console.error("Error fetching summaries:", err);
        setError("Unable to load summaries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  // ✅ Delete Summary
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this summary?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/summaries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete summary");

      setSummaries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting summary. Try again.");
    }
  };

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Search Filter
  const filteredSummaries = summaries.filter((item) =>
    item.text?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-indigo-700">
          Saved Summaries
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6 w-full">
        <input
          type="text"
          placeholder="Search summaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="p-2 border rounded-lg hover:bg-gray-100">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Summaries List */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-gray-500">Loading summaries...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredSummaries.length > 0 ? (
          filteredSummaries.map((item) => (
            <SummaryCard
              key={item._id}
              summary={item}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No saved summaries found.</p>
            <p className="text-sm mt-2">
              Try creating one from the <span className="font-medium">Summarizer</span> page!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
