import express from "express";
import { uploadFile } from "../Middleware/upload.js";

const router = express.Router();

router.post("/", uploadFile.single("file"), (req, res) => {
  if (!req.file) {
    return res.json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    fileUrl: req.file.path
  });
});

export default router;
