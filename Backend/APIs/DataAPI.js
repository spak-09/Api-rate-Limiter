import exp from "express";
import asyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { requestLogger } from "../middlewares/requestLogger.js";
import ProductModel from "../models/ProductModel.js";
import PostModel from "../models/PostModel.js";
import NewsModel from "../models/NewsModel.js";

export const dataApp = exp.Router();

// Products API - Counted for rate limiting and analytics
dataApp.get(
  "/products",
  verifyToken,
  requestLogger,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find().select("_id name description").lean();
    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  })
);

// Posts API - Counted for rate limiting and analytics
dataApp.get(
  "/posts",
  verifyToken,
  requestLogger,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const posts = await PostModel.find().select("_id title content").lean();
    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length,
    });
  })
);

// News API - Counted for rate limiting and analytics
dataApp.get(
  "/news",
  verifyToken,
  requestLogger,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const news = await NewsModel.find().select("_id title content").lean();
    res.status(200).json({
      success: true,
      data: news,
      count: news.length,
    });
  })
);
