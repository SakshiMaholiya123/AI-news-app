// src/pages/SummarizerPage.jsx
import React, { useState } from "react";
import axios from "axios";
import SummaryCard from "../components/SummaryCard";

export default function SummarizerPage() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!input.trim()) {
      setError("⚠️ Please paste some text or a valid URL.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/summarize", { text: input });
      setSummary({ _id: Date.now(), text: data.summary });
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong! Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-3 text-indigo-700 text-center">
        Summarize News Instantly
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-lg">
        Paste any news article text or link below and get a concise AI-powered summary.
      </p>

      {/* Input Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 w-full max-w-2xl">
        <textarea
          className="w-full p-4 border rounded-xl h-40 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Paste news text or URL here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        <button
          className={`mt-4 w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-indigo-700 cursor-not-allowed text-white"
              : "bg-indigo-700 hover:bg-indigo-700 text-white"
          }`}
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </div>

      {/* Summary Result */}
      {summary && (
        <div className="mt-8 w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            Summary Result
          </h3>
          <SummaryCard summary={summary} />
        </div>
      )}
    </div>
  );
}
