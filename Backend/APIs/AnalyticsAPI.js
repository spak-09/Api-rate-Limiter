import exp from "express";
import asyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import RequestLogModel from "../models/RequestLogModel.js";
import BlockedRequestModel from "../models/BlockedRequestModel.js";
import SettingsModel from "../models/SettingsModel.js";

export const analyticsApp = exp.Router();

analyticsApp.get(
  "/requests",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const requests = await RequestLogModel.find({ path: { $regex: "^/api/data/" } }).sort({ timestamp: -1 }).limit(200).lean();
    res.status(200).json({ success: true, requests });
  })
);

analyticsApp.get(
  "/blocked",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const blocked = await BlockedRequestModel.find({ path: { $regex: "^/api/data/" } }).sort({ timestamp: -1 }).limit(200).lean();
    res.status(200).json({ success: true, blocked });
  })
);

analyticsApp.get(
  "/overview",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const totalRequests = await RequestLogModel.countDocuments({ path: { $regex: "^/api/data/" } });
    const totalBlocked = await BlockedRequestModel.countDocuments({ path: { $regex: "^/api/data/" } });
    const settings = await SettingsModel.findOne();

    res.status(200).json({
      success: true,
      overview: {
        totalRequests,
        totalBlocked,
        settings,
      },
    });
  })
);
