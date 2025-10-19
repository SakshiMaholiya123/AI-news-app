import React, { useState } from "react";
import { Clipboard, ClipboardCheck, Trash2 } from "lucide-react";

export default function SummaryCard({ summary, onDelete }) {
  const [copied, setCopied] = useState(false);

  // ✅ Handle Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(summary.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 transition-all hover:shadow-xl">
      {/* Title */}
      <h3 className="font-semibold text-lg mb-3 text-indigo-600">
        AI Summary
      </h3>

      {/* Summary Text */}
      <p className="text-gray-800 mb-5 leading-relaxed whitespace-pre-line break-words">
        {summary.text}
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
            copied
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          }`}
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4" /> Copy
            </>
          )}
        </button>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(summary._id)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
