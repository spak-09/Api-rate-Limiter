import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    source: { type: String, default: "Tech News" },
    category: { type: String, default: "Technology" },
  },
  {
    collection: "news",
    timestamps: true,
  }
);

const NewsModel = mongoose.model("News", newsSchema);

export const initializeNews = async () => {
  try {
    const count = await NewsModel.countDocuments();
    if (count === 0) {
      const news = [
        { title: "Redis releases new version", content: "Redis 7.2 brings performance improvements and new features...", source: "Tech News", category: "Database" },
        { title: "MongoDB performance update", content: "MongoDB 7.0 introduces query optimization features...", source: "Tech News", category: "Database" },
        { title: "Node.js ecosystem growth", content: "NPM registry crosses 2 million packages...", source: "Tech News", category: "Backend" },
        { title: "Express 5 released", content: "Express.js 5.0 introduces async middleware support...", source: "Tech News", category: "Framework" },
        { title: "WebSocket adoption increasing", content: "Real-time web applications become mainstream...", source: "Tech News", category: "Realtime" },
      ];
      await NewsModel.insertMany(news);
    }
  } catch (error) {
    console.error("Error initializing news:", error.message);
  }
};

export default NewsModel;
