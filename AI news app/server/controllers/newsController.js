  // controllers/newsController.js
  import axios from "axios";

  // ✅ Valid categories supported by NewsAPI
  const VALID_CATEGORIES = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];

  // 📌 Get news by category
  export const getByCategory = async (req, res, next) => {
    try {
      let category = req.query.category || "general";

      // fallback to "general" if invalid category is passed
      if (!VALID_CATEGORIES.includes(category)) {
        category = "general";
      }

      const key = process.env.NEWS_API_KEY;

      if (key) {
        const url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(
          category
        )}&pageSize=10&country=us&apiKey=${key}`;

        const { data } = await axios.get(url);

        // Ensure `articles` is always an array
        const articles = Array.isArray(data?.articles) ? data.articles : [];

        // 📰 Map to a simplified shape
        const mapped = articles.map((a) => ({
          title: a.title || "No title",
          description: a.description || "No description",
          url: a.url || "#",
          source: a.source?.name || "Unknown",
          publishedAt: a.publishedAt || null,
          image: a.urlToImage || null,
        }));

        return res.json(mapped);
      } else {
        // 🔄 Fallback dummy data if NEWS_API_KEY is not set
        const dummy = [
          {
            title: "AI transforms industry",
            description: "AI is being used widely...",
            url: "#",
            source: "Demo",
            publishedAt: new Date().toISOString(),
            image: null,
          },
          {
            title: "Market update",
            description: "Markets went up today...",
            url: "#",
            source: "Demo",
            publishedAt: new Date().toISOString(),
            image: null,
          },
        ];
        return res.json(dummy);
      }
    } catch (err) {
      console.error("Error fetching news:", err.message);
      return res.status(500).json({
        message: "Failed to fetch news articles. Please try again later.",
        error: err.message,
      });
    }
  };
