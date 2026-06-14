import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/UserModel.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || req.cookies.token;
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.split(" ")[1]
    : authorizationHeader;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized access");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid token");
  }

  req.user = user;
  next();
});
