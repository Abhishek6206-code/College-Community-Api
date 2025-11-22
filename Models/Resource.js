import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },     
  year: { type: String, required: true },       
  subject: { type: String, required: true },     
  type: { type: String, enum: ["notes", "exam"], required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export const Resource = mongoose.model("Resource", resourceSchema);