import React from "react";

export default function SummaryCard({ summary, onDelete }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 mb-5 border border-gray-200 transition hover:shadow-xl">
      <h3 className="font-semibold text-lg mb-3 text-indigo-600">AI Summary</h3>

      <p className="text-gray-800 mb-5 leading-relaxed">{summary.text}</p>

      <div className="flex justify-end gap-3">
        {/* Copy Button */}
        <button
          onClick={() => navigator.clipboard.writeText(summary.text)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
        >
          Copy
        </button>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(summary._id)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
