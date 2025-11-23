import express from "express";
import { uploadResource, getResources, deleteResource } from "../Controllers/resource.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { uploadFile } from "../Middleware/upload.js";

const router = express.Router();


router.post(
  "/upload",
  isAuthenticated,
  (req, res, next) => {
    uploadFile.single("file")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(400).json({
          error: err.message || "File upload failed",
        });
      }
      next();
    });
  },
  uploadResource
);

// GET all resources
router.get("/", getResources);

// DELETE a resource
router.delete("/:id", isAuthenticated, deleteResource);

export default router;
