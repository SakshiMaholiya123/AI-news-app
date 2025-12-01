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
          setError("Please login first to view news.");
          return;
        }

        const { data } = await axios.get(
          `http://localhost:5000/api/news?category=${selected}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching news:", err);
        setError(
          err.response?.data?.message || 
          "Failed to load news. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selected]);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-700">
          Browse News by Category
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select a category to view the latest news
        </p>

        {/* Categories Grid */}
        {!selected && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition cursor-pointer"
                  onClick={() => setSelected(cat.name)}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">Click to view news</p>
                </div>
              ))}
            </div>

            {/* Small info section to fill space */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
              <p className="text-sm text-indigo-900">
                💡 <strong>Tip:</strong> Get AI-powered summaries of any article using our Summarizer tool
              </p>
            </div>
          </>
        )}

        {/* Selected Category News */}
        {selected && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-700">
                {selected} News
              </h2>
              <button
                onClick={() => {
                  setSelected(null);
                  setNews([]);
                  setError(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm"
              >
                ← Back
              </button>
            </div>

            {loading && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                <p className="text-gray-500 mt-3 text-sm">Loading...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {news.length > 0 ? (
                  news.map((article, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                    >
                      <div className="md:flex">
                        {article.image && (
                          <div className="md:w-48 h-40 md:h-auto overflow-hidden bg-gray-100">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="p-4 flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span className="font-medium text-indigo-600">
                              {article.source}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {article.description}
                          </p>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Read more →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No news available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
