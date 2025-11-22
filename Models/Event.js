import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  place: { type: String, required: true },
  contactInfo: { type: String, required: true },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Event = mongoose.model("Event", eventSchema);