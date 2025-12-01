// models/Summary.js
import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalText: { type: String, required: true }, // the input/article text
    summary: { type: String, required: true },      // the generated summary text
  },
  { timestamps: true }
);

const Summary = mongoose.model("Summary", summarySchema);
export default Summary;
