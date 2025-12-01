import { useState, useEffect } from "react";
import { Search, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import { useNavigate } from "react-router-dom";

export default function SavedSummaries() {
  const [summaries, setSummaries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSummaries, setTotalSummaries] = useState(0);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch summaries with pagination
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${BASE_URL}/api/summary?page=${currentPage}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch summaries");

        const data = await res.json();

        // ✅ Use pagination object from backend
        setSummaries(data.summaries || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalSummaries(data.pagination?.totalSummaries || 0);
      } catch (err) {
        console.error("Error fetching summaries:", err);
        setError("Unable to load summaries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [currentPage, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this summary?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/summary/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete summary");

      setSummaries((prev) => prev.filter((item) => item._id !== id));
      setTotalSummaries((prev) => prev - 1);

      if (summaries.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting summary. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // ✅ Search filter (use summary + originalText)
  const filteredSummaries = summaries.filter((item) =>
    item.summary?.toLowerCase().includes(search.toLowerCase()) ||
    item.originalText?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">Saved Summaries</h1>
          <p className="text-sm text-gray-600">
            {totalSummaries} {totalSummaries === 1 ? "summary" : "summaries"} saved
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
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
      <div className="space-y-4 mb-6">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading summaries...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
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
            <p className="text-lg">No summaries found.</p>
            <p className="text-sm mt-2">
              {search
                ? "Try a different search term."
                : 'Try creating one from the "Summarizer" page!'}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          {/* Info */}
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    currentPage === page
                      ? "bg-indigo-700 text-white border-indigo-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Items per page info */}
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * 5 + 1, totalSummaries)}-
            {Math.min(currentPage * 5, totalSummaries)} of {totalSummaries}
          </div>
        </div>
      )}
    </div>
  );
}
