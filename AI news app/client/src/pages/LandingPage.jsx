import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/summarize"); // logged in → go to summarize
    } else {
      navigate("/login"); // not logged in → go to login
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">
          Summarize News in Seconds with AI 🚀
        </h1>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Paste news articles, enter URLs, or upload documents — and let AI give you 
          a clear, concise summary instantly.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-800 transition"
        >
          Get Started
        </button>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-10">
          <div className="p-6 bg-white shadow rounded-xl border hover:shadow-md transition">
            <h3 className="text-indigo-700 font-semibold text-lg mb-2">Paste Articles</h3>
            <p className="text-gray-600">Copy-paste any news article and get an instant summary.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl border hover:shadow-md transition">
            <h3 className="text-indigo-700 font-semibold text-lg mb-2">Enter URLs</h3>
            <p className="text-gray-600">Provide a news website link, and AI will summarize it for you.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl border hover:shadow-md transition">
            <h3 className="text-indigo-700 font-semibold text-lg mb-2">Save Summaries</h3>
            <p className="text-gray-600">Store, copy, or delete summaries easily on your dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
