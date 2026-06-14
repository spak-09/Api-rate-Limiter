import exp from "express";
import asyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import SettingsModel from "../models/SettingsModel.js";
import UserModel from "../models/UserModel.js";
import RequestLogModel from "../models/RequestLogModel.js";
import BlockedRequestModel from "../models/BlockedRequestModel.js";

export const adminApp = exp.Router();

adminApp.post(
  "/algorithm",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { algorithm } = req.body;
    const validAlgorithms = ["fixed-window", "sliding-window", "token-bucket", "leaky-bucket"];

    if (!validAlgorithms.includes(algorithm)) {
      res.status(400);
      throw new Error("Invalid algorithm selection");
    }

    const settings = await SettingsModel.findOneAndUpdate(
      {},
      { algorithm },
      { new: true, upsert: true }
    );

    const io = req.app.get("io");
    if (io) {
      io.emit("algorithm-changed", { algorithm });
    }

    res.status(200).json({ success: true, settings });
  })
);

adminApp.post(
  "/limits",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { maxRequests, windowSize } = req.body;

    if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
      res.status(400);
      throw new Error("Max requests must be a positive number");
    }

    if (!Number.isInteger(windowSize) || windowSize <= 0) {
      res.status(400);
      throw new Error("Window size must be a positive number");
    }

    const settings = await SettingsModel.findOneAndUpdate(
      {},
      { maxRequests, windowSize },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, settings });
  })
);

adminApp.post(
  "/user/:userId/algorithm",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { algorithm } = req.body;
    const validAlgorithms = ["fixed-window", "sliding-window", "token-bucket", "leaky-bucket"];

    if (!validAlgorithms.includes(algorithm)) {
      res.status(400);
      throw new Error("Invalid algorithm selection");
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { algorithm },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("user-algorithm-changed", { userId, algorithm });
    }

    res.status(200).json({ success: true, user });
  })
);

adminApp.post(
  "/user/:userId/limits",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { maxRequests, windowSize } = req.body;

    if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
      res.status(400);
      throw new Error("Max requests must be a positive number");
    }

    if (!Number.isInteger(windowSize) || windowSize <= 0) {
      res.status(400);
      throw new Error("Window size must be a positive number");
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { maxRequests, windowSize },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({ success: true, user });
  })
);

adminApp.get(
  "/users",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, users });
  })
);

adminApp.get(
  "/stats",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const userCount = await UserModel.countDocuments({ role: "user" });
    const requestCount = await RequestLogModel.countDocuments({ path: { $regex: "^/api/data/" } });
    const blockedCount = await BlockedRequestModel.countDocuments({ path: { $regex: "^/api/data/" } });
    const settings = await SettingsModel.findOne();

    res.status(200).json({
      success: true,
      stats: {
        userCount,
        requestCount,
        blockedCount,
        settings,
      },
    });
  })
);

adminApp.get(
  "/top-users",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const topUsers = await RequestLogModel.aggregate([
      { $match: { path: { $regex: "^/api/data/" } } },
      { $group: { _id: "$userId", requestCount: { $sum: 1 } } },
      { $sort: { requestCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          requestCount: 1,
          userId: "$_id",
          userName: "$user.name",
          userEmail: "$user.email",
        },
      },
    ]);

    res.status(200).json({ success: true, topUsers });
  })
);
