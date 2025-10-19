// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// ✅ Initialize Gemini client once globally
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Text is required for summarization." });
    }

    // ✅ Use modern supported model
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest" 
    });

    const prompt = `Summarize this text clearly and concisely:\n\n${text}`;

    // ✅ Await response properly
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Gemini summarization error:", error);
    res.status(500).json({
      message: "Failed to generate summary",
      error: error.message,
    });
  }
};
