import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../Controllers/event.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { uploadImage } from "../Middleware/upload.js";

const router = express.Router();

router.post("/", isAuthenticated, uploadImage.single("image"), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", isAuthenticated, uploadImage.single("image"), updateEvent);
router.delete("/:id", isAuthenticated, deleteEvent);

export default router;
