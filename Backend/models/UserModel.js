import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    profileImageUrl: { type: String, default: "" },
    algorithm: { type: String, default: null },
    maxRequests: { type: Number, default: null },
    windowSize: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "users",
  }
);

const UserModel = mongoose.model("User", userSchema);

export const initializeAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error("Admin credentials are required");
  }

  const existingAdmin = await UserModel.findOne({ email: adminEmail });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await UserModel.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });
};

export default UserModel;
