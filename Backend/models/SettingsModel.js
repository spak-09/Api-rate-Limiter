import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    algorithm: { type: String, default: "fixed-window" },
    maxRequests: { type: Number, default: 100 },
    windowSize: { type: Number, default: 60 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "settings",
  }
);

const SettingsModel = mongoose.model("Settings", settingsSchema);

export const initDefaultSettings = async () => {
  const existingSettings = await SettingsModel.findOne();

  if (!existingSettings) {
    await SettingsModel.create({
      algorithm: "fixed-window",
      maxRequests: 100,
      windowSize: 60,
    });
  }
};

export default SettingsModel;
