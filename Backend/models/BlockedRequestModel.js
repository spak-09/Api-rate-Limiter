import mongoose from "mongoose";

const blockedRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    path: { type: String, required: true },
    algorithm: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
  },
  {
    collection: "blockedrequests",
  }
);

const BlockedRequestModel = mongoose.model("BlockedRequest", blockedRequestSchema);

export default BlockedRequestModel;
