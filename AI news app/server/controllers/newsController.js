import axios from "axios";

export const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (!process.env.GNEWS_API_KEY) {
      return res.status(500).json({ message: "News API key not configured" });
    }

    const categoryMap = {
      Technology: "technology",
      Politics: "nation",
      Sports: "sports",
      Business: "business",
      Health: "health",
      Entertainment: "entertainment",
    };

    const gnewsCategory = categoryMap[category] || "general";

    console.log("Fetching news for category:", category);

    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        category: gnewsCategory,
        lang: "en",
        country: "in",
        max: 10,
        apikey: process.env.GNEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source.name,
    }));

    console.log(`Found ${articles.length} articles for category: ${category}`);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error.response?.data || error.message);

    if (error.response?.status === 403) {
      return res.status(403).json({
        message: "API key invalid or rate limit exceeded",
      });
    }

    res.status(500).json({
      message: "Error fetching news",
      error: error.message,
    });
  }
};
