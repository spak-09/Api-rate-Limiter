import asyncHandler from "express-async-handler";
import RequestLogModel from "../models/RequestLogModel.js";

// Only log data API responses. Capture response body by wrapping res.send.
export const requestLogger = asyncHandler(async (req, res, next) => {
  const isDataApi = req.originalUrl && req.originalUrl.startsWith("/api/data/");

  if (!isDataApi) {
    return next();
  }

  const userId = req.user?._id || null;
  const ip = req.ip;
  const path = req.originalUrl;
  const method = req.method;

  const oldSend = res.send;

  res.send = function sendOverride(body) {
    try {
      let responseData = body;

      // If body is a Buffer, convert to string
      if (Buffer.isBuffer(body)) {
        responseData = body.toString("utf8");
      }

      // Try to parse JSON bodies
      if (typeof responseData === "string") {
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // keep as string
        }
      }

      RequestLogModel.create({
        userId,
        path,
        method,
        statusCode: res.statusCode,
        responseData,
        timestamp: new Date(),
        ipAddress: ip,
      }).catch((err) => {
        console.error("Failed to write request log:", err && err.message ? err.message : err);
      });
    } catch (err) {
      // swallow logging errors
      console.error("requestLogger error:", err && err.message ? err.message : err);
    }

    return oldSend.call(this, body);
  };

  next();
});
