// models/News.js
import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    source: { type: String },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

export default News;
