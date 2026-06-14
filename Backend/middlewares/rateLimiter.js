import asyncHandler from "express-async-handler";
import SettingsModel from "../models/SettingsModel.js";
import BlockedRequestModel from "../models/BlockedRequestModel.js";
import { fixedWindow } from "../algorithms/fixedWindow.js";
import { slidingWindow } from "../algorithms/slidingWindow.js";
import { tokenBucket } from "../algorithms/tokenBucket.js";
import { leakyBucket } from "../algorithms/leakyBucket.js";

const algorithmMap = {
  "fixed-window": fixedWindow,
  "sliding-window": slidingWindow,
  "token-bucket": tokenBucket,
  "leaky-bucket": leakyBucket,
};

export const rateLimiter = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id?.toString() ?? "guest";
  
  const systemSettings = await SettingsModel.findOne();

  if (!systemSettings) {
    return next();
  }

  let settings = {
    algorithm: systemSettings.algorithm,
    maxRequests: systemSettings.maxRequests,
    windowSize: systemSettings.windowSize,
  };

  if (req.user) {
    if (req.user.algorithm) {
      settings.algorithm = req.user.algorithm;
    }

    if (Number.isInteger(req.user.maxRequests) && req.user.maxRequests > 0) {
      settings.maxRequests = Math.min(req.user.maxRequests, systemSettings.maxRequests);
    }

    if (Number.isInteger(req.user.windowSize) && req.user.windowSize > 0) {
      settings.windowSize = Math.min(req.user.windowSize, systemSettings.windowSize);
    }
  }

  const algorithmFunction = algorithmMap[settings.algorithm] || fixedWindow;
  const result = await algorithmFunction(userId, settings);

  if (!result.allowed) {
    await BlockedRequestModel.create({
      userId: req.user?._id || null,
      path: req.originalUrl,
      algorithm: settings.algorithm,
      timestamp: new Date(),
      ipAddress: req.ip,
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("blocked-request", {
        userId,
        path: req.originalUrl,
        algorithm: settings.algorithm,
        timestamp: new Date(),
        ipAddress: req.ip,
      });
    }

    res.status(429);
    throw new Error("Too Many Requests");
  }

  res.setHeader("X-RateLimit-Remaining", result.remaining);
  next();
});
