import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is required");
  }

  mongoose.set("strictQuery", false);

  await mongoose.connect(uri, {
    dbName: "apirate",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
