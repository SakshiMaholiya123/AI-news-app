import { GoogleGenerativeAI } from "@google/generative-ai";

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 🔁 CHANGE THIS LINE ONLY
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // or whatever exact id AI Studio shows for your project

    const prompt = `Summarize the following text in 5–7 lines:\n\n${text}`;
    const result = await model.generateContent(prompt);

    const summary = result.response.text();
    res.json({ summary });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      message: "Error generating summary",
      error: error.message,
    });
  }
};
