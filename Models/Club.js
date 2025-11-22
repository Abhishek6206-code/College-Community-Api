import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  coverImage: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["admin", "member"], default: "member" }
    }
  ],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },  // 👈 link to group
  createdAt: { type: Date, default: Date.now }
});

export const Club = mongoose.model("Club", clubSchema);
