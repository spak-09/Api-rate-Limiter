import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Tech Writer" },
    category: { type: String, default: "Technology" },
  },
  {
    collection: "posts",
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", postSchema);

export const initializePosts = async () => {
  try {
    const count = await PostModel.countDocuments();
    if (count === 0) {
      const posts = [
        { title: "Introduction to Redis", content: "Redis is an in-memory data structure store...", author: "Tech Writer", category: "Technology" },
        { title: "Understanding JWT", content: "JWT is a compact, URL-safe means of representing claims...", author: "Tech Writer", category: "Security" },
        { title: "Node.js Middleware", content: "Middleware functions are functions that have access to the request object...", author: "Tech Writer", category: "Backend" },
        { title: "Rate Limiting Algorithms", content: "Rate limiting is a technique used to control resource usage...", author: "Tech Writer", category: "Backend" },
        { title: "Socket.IO Basics", content: "Socket.IO is a JavaScript library for realtime web applications...", author: "Tech Writer", category: "Realtime" },
      ];
      await PostModel.insertMany(posts);
    }
  } catch (error) {
    console.error("Error initializing posts:", error.message);
  }
};

export default PostModel;
