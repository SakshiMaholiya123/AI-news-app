// controllers/summaryController.js
import Summary from "../models/Summary.js";

export const createSummary = async (req, res, next) => {
  try {
    const { originalText, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Summary text is required" });
    }

    const newSummary = await Summary.create({
      user: req.user._id,
      originalText: originalText?.trim() || "",
      text: text.trim(),
    });

    return res.status(201).json(newSummary);
  } catch (err) {
    next(err);
  }
};


// ✅ Get all summaries for current user (protected)
export const getUserSummaries = async (req, res, next) => {
  try {
    const summaries = await Summary.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // ⚡ lean() → better performance, returns plain JS objects

    return res.json(summaries);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete a summary (protected)
export const deleteSummary = async (req, res, next) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    if (summary.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this summary" });
    }

    await Summary.findByIdAndDelete(summary._id);

    return res.json({ message: "Summary deleted successfully" });
  } catch (err) {
    next(err);
  }
};
