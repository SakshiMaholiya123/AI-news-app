import { useState, useEffect } from "react";
import { Search, LogOut } from "lucide-react";
import SummaryCard from "../components/SummaryCard";

export default function SavedSummaries() {
  const [summaries, setSummaries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch saved summaries from backend
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/summaries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch summaries");
        const data = await res.json();
        setSummaries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  // ✅ Delete summary from backend
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/summaries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete summary");

      // Remove from UI after delete
      setSummaries(summaries.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ✅ Filter summaries by search text
  const filteredSummaries = summaries.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with Title + Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Saved Summaries</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
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
        ) : filteredSummaries.length > 0 ? (
          filteredSummaries.map((item) => (
            <SummaryCard key={item._id} summary={item} onDelete={handleDelete} />
          ))
        ) : (
          <p className="text-gray-500">No saved summaries found.</p>
        )}
      </div>
    </div>
  );
}
