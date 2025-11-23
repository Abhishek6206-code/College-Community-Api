import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../Controllers/event.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { upload } from "../Middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(400).json({ error: err.message || "Image upload failed" });
      }
      next();
    });
  },
  createEvent
);

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(400).json({ error: err.message || "Image upload failed" });
      }
      next();
    });
  },
  updateEvent
);

router.delete("/:id", isAuthenticated, deleteEvent);

export default router;
