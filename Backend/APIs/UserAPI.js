import exp from "express";
import asyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/verifyToken.js";
import RequestLogModel from "../models/RequestLogModel.js";
import BlockedRequestModel from "../models/BlockedRequestModel.js";
import SettingsModel from "../models/SettingsModel.js";
import UserModel from "../models/UserModel.js";

export const userApp = exp.Router();

userApp.get(
  "/profile",
  verifyToken,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  })
);

userApp.get(
  "/usage",
  verifyToken,
  asyncHandler(async (req, res) => {
    const requestFilter = { userId: req.user._id, path: { $regex: "^/api/data/" } };
    const totalRequests = await RequestLogModel.countDocuments(requestFilter);
    const blockedRequests = await BlockedRequestModel.countDocuments(requestFilter);
    const recentRequests = await RequestLogModel.find(requestFilter)
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    const systemSettings = await SettingsModel.findOne();
    const effectiveSettings = {
      algorithm: systemSettings?.algorithm || req.user.algorithm || "fixed-window",
      maxRequests: systemSettings?.maxRequests ?? req.user.maxRequests ?? 100,
      windowSize: systemSettings?.windowSize ?? req.user.windowSize ?? 60,
    };

    if (req.user) {
      if (req.user.algorithm) {
        effectiveSettings.algorithm = req.user.algorithm;
      }

      if (Number.isInteger(req.user.maxRequests) && req.user.maxRequests > 0) {
        effectiveSettings.maxRequests = Math.min(req.user.maxRequests, effectiveSettings.maxRequests);
      }

      if (Number.isInteger(req.user.windowSize) && req.user.windowSize > 0) {
        effectiveSettings.windowSize = Math.min(req.user.windowSize, effectiveSettings.windowSize);
      }
    }

    const remainingRequests = Math.max(0, effectiveSettings.maxRequests - totalRequests);
    const currentAlgorithm = effectiveSettings.algorithm;

    res.status(200).json({
      success: true,
      usage: {
        totalRequests,
        remainingRequests,
        blockedRequests,
        currentAlgorithm,
        effectiveLimit: effectiveSettings.maxRequests,
        effectiveWindow: effectiveSettings.windowSize,
        recentRequests,
      },
    });
  })
);

userApp.get(
  "/blocked",
  verifyToken,
  asyncHandler(async (req, res) => {
    const blocked = await BlockedRequestModel.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      blocked,
    });
  })
);

// Allow regular users to update their own algorithm
userApp.post(
  "/algorithm",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { algorithm } = req.body;
    const validAlgorithms = ["fixed-window", "sliding-window", "token-bucket", "leaky-bucket"];

    if (!validAlgorithms.includes(algorithm)) {
      res.status(400);
      throw new Error("Invalid algorithm selection");
    }

    const user = await UserModel.findByIdAndUpdate(req.user._id, { algorithm }, { new: true }).select("-password");

    res.status(200).json({ success: true, user });
  })
);

// Allow regular users to set their own limits
userApp.post(
  "/limits",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { maxRequests, windowSize } = req.body;

    if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
      res.status(400);
      throw new Error("Max requests must be a positive integer");
    }

    if (!Number.isInteger(windowSize) || windowSize <= 0) {
      res.status(400);
      throw new Error("Window size must be a positive integer");
    }

    const user = await UserModel.findByIdAndUpdate(req.user._id, { maxRequests, windowSize }, { new: true }).select("-password");

    res.status(200).json({ success: true, user });
  })
);

