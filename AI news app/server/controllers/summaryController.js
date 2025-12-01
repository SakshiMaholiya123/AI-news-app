import Summary from "../models/Summary.js";

export const createSummary = async (req, res) => {
  try {
    const { originalText, summary } = req.body;  // must be these names

    if (!originalText || !summary) {
      return res.status(400).json({
        success: false,
        message: "Original text and summary are required.",
      });
    }

    const newSummary = new Summary({
      user: req.user.id,
      originalText,
      summary,
    });

    const savedSummary = await newSummary.save();

    res.status(201).json({
      success: true,
      message: "Summary saved successfully.",
      summary: savedSummary,
    });
  } catch (error) {
    console.error("CREATE SUMMARY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creating summary.",
      error: error.message,
    });
  }
};


/* ============================================================
   GET SUMMARIES (PAGINATED)
   ============================================================ */
export const getSummaries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalSummaries = await Summary.countDocuments({ user: req.user.id });

    const summaries = await Summary.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      summaries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSummaries / limit),
        totalSummaries,
        limit,
      },
    });

  } catch (error) {
    console.error("GET SUMMARIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching summaries.",
      error: error.message,
    });
  }
};


/* ============================================================
   DELETE SUMMARY
   ============================================================ */
export const deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found.",
      });
    }

    if (summary.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this summary.",
      });
    }

    await summary.deleteOne();

    res.json({
      success: true,
      message: "Summary deleted successfully.",
      id: req.params.id,
    });

  } catch (error) {
    console.error("DELETE SUMMARY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting summary.",
      error: error.message,
    });
  }
};
