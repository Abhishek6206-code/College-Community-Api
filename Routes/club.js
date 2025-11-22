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
import { uploadImage } from "../Middleware/upload.js";

const router = express.Router();

router.post("/", isAuthenticated, uploadImage.single("coverImage"), createClub);
router.get("/", getAllClubs);
router.get("/:id", getClubById);
router.post("/:id/request", isAuthenticated, requestToJoinClub);
router.post("/:id/accept/:userId", isAuthenticated, acceptMember);
router.post("/:id/leave", isAuthenticated, leaveClub);
router.put("/:id", isAuthenticated, uploadImage.single("coverImage"), updateClub);
router.delete("/:id", isAuthenticated, deleteClub);

export default router;
