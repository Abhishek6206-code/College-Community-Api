import express from "express";
import { upload } from "../Middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    fileUrl: req.file.path
  });
});

export default router;
