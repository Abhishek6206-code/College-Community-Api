import express from "express";
import { uploadResource, getResources, deleteResource } from "../Controllers/resource.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { uploadFile } from "../Middleware/upload.js";

const router = express.Router();

router.post(
  "/upload",
  isAuthenticated,
  uploadFile.single("file"),
  uploadResource
);

router.get("/", getResources);
router.delete("/:id", isAuthenticated, deleteResource);

export default router;
