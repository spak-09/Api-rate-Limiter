import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    path: { type: String, required: true },
    method: { type: String, required: true },
    statusCode: { type: Number },
    responseData: { type: mongoose.Schema.Types.Mixed, default: null },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
  },
  {
    collection: "requestlogs",
  }
);

const RequestLogModel = mongoose.model("RequestLog", requestLogSchema);

export default RequestLogModel;
