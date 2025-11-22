import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  branch: { type: String },
  year: { type: String },
  clubsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  profilePic: { type: String },
  bio: { type: String },

  role: { type: String, enum: ["user"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
