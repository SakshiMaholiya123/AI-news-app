import { useState, useEffect } from "react";
import axios from "axios";

const categories = [
  { id: 1, name: "Technology", icon: "💻" },
  { id: 2, name: "Politics", icon: "🏛️" },
  { id: 3, name: "Sports", icon: "🏅" },
  { id: 4, name: "Business", icon: "💼" },
  { id: 5, name: "Health", icon: "🩺" },
  { id: 6, name: "Entertainment", icon: "🎬" },
];

export default function Categories() {
  const [selected, setSelected] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selected) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login first to view news.");
          return;
        }

        const { data } = await axios.get(
          `http://localhost:5000/api/news?category=${selected}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Expecting backend to return an array of news articles
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Browse News by Category
      </h1>

      {/* ✅ Categories Grid */}
      {!selected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelected(cat.name)}
            >
              <div className="text-4xl">{cat.icon}</div>
              <h2 className="text-xl font-semibold mt-4">{cat.name}</h2>
              <p className="text-sm text-gray-500 mt-2">Click to view news</p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Selected Category News */}
      {selected && (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            {selected} News
          </h2>

          {loading && <p className="text-gray-500">Loading news...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <ul className="list-disc list-inside space-y-2">
              {news.length > 0 ? (
                news.map((item, i) => (
                  <li key={i} className="text-gray-700">
                    {item.title || item?.headline || item}{" "}
                    {/* ✅ Handle object or string */}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No news available.</p>
              )}
            </ul>
          )}

          <button
            onClick={() => {
              setSelected(null);
              setNews([]);
            }}
            className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Back to Categories
          </button>
        </div>
      )}
    </div>
  );
}
