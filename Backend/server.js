import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { redisClient } from "./config/redis.js";
import { initAnalyticsSocket } from "./Sockets/analyticsSocket.js";
import { initDefaultSettings } from "./models/SettingsModel.js";
import { initializeAdminUser } from "./models/UserModel.js";
import { initializeProducts } from "./models/ProductModel.js";
import { initializePosts } from "./models/PostModel.js";
import { initializeNews } from "./models/NewsModel.js";

dotenv.config();

const port = process.env.PORT || 5000;
const server = createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();
    if (redisClient.status !== "connecting" && redisClient.status !== "ready") {
      await redisClient.connect();
    }
    initAnalyticsSocket(server, app);
    await initDefaultSettings();
    await initializeAdminUser();
    await initializeProducts();
    await initializePosts();
    await initializeNews();

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();
