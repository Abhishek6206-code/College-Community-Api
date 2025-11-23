import express from "express";
import {
  createClub,
  getAllClubs,
  getClubById,
  requestToJoinClub,
  acceptMember,
  leaveClub,
  updateClub,
  deleteClub
} from "../Controllers/Club.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { upload } from "../Middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  (req, res, next) => {
    upload.single("coverImage")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(400).json({ error: err.message || "Image upload failed" });
      }
      next();
    });
  },
  createClub
);

router.get("/", getAllClubs);
router.get("/:id", getClubById);

router.post("/:id/request", isAuthenticated, requestToJoinClub);
router.post("/:id/accept/:userId", isAuthenticated, acceptMember);
router.post("/:id/leave", isAuthenticated, leaveClub);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) => {
    upload.single("coverImage")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(400).json({ error: err.message || "Image upload failed" });
      }
      next();
    });
  },
  updateClub
);

router.delete("/:id", isAuthenticated, deleteClub);

export default router;
