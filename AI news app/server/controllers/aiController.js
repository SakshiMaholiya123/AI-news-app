// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const summarizeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Text is required" });

    const prompt = `Summarize the following news article in 3-4 concise sentences:\n\n${text}`;
    const result = await model.generateContent(prompt);

    const summary = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                    "No summary could be generated.";

    res.json({ summary });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    next(err);
  }
};
