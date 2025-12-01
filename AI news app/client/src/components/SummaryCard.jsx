import React, { useState } from "react";
import { Clipboard, ClipboardCheck, Trash2, Calendar } from "lucide-react";

export default function SummaryCard({ summary, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summary || summary.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 transition-all hover:shadow-xl">
      {/* ✅ OPTION 1: Small timestamp instead of "AI Summary" */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Calendar className="w-3 h-3" />
        <span>
          {new Date(summary.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>

      {/* Summary Text */}
      <p className="text-gray-800 mb-5 leading-relaxed whitespace-pre-line break-words">
        {summary.summary || summary.text || "No summary available"}
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
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
