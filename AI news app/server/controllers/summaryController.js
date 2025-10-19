import Summary from "../models/Summary.js";

// ✅ Create a new summary record
export const createSummary = async (req, res) => {
  try {
    const { text, summary } = req.body;
    const newSummary = new Summary({
      user: req.user.id,
      text,
      summary,
    });
    const saved = await newSummary.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creating summary", error });
  }
};

// ✅ Get all summaries for user
export const getSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user.id });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching summaries", error });
  }
};

// ✅ Delete one summary
export const deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ message: "Summary not found" });

    if (summary.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await summary.deleteOne();
    res.json({ message: "Summary deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting summary", error });
  }
};
