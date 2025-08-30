import { useState } from "react";
import { Search, LogOut } from "lucide-react";
import SummaryCard from "../components/SummaryCard"; // ✅ use your custom card

export default function SavedSummaries() {
  // Dummy saved summaries for now
  const [summaries, setSummaries] = useState([
    {
      _id: 1,
      text: "Artificial Intelligence is improving diagnostics, drug discovery, and personalized treatments.",
    },
    {
      _id: 2,
      text: "Rising temperatures are leading to extreme weather events and sea level rise worldwide.",
    },
    {
      _id: 3,
      text: "SpaceX successfully launched its latest batch of Starlink satellites into low Earth orbit.",
    },
  ]);

  const [search, setSearch] = useState("");

  // Filter summaries
  const filteredSummaries = summaries.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  // Delete summary
  const handleDelete = (id) => {
    setSummaries(summaries.filter((item) => item._id !== id));
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear token / user data (if any)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with Title + Logout */}
      <div className="flex justify-between items-center mb-6">
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
        {filteredSummaries.length > 0 ? (
          filteredSummaries.map((item) => (
            <SummaryCard
              key={item._id}
              summary={item}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">No saved summaries found.</p>
        )}
      </div>
    </div>
  );
}
