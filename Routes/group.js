import express from "express";
import {
  createGroup,
  getGroups,
  getMyGroups,
  joinGroup,
  getMessages,
  removeMember,
  leaveGroup,
  acceptRequest
} from "../Controllers/group.js";
import { isAuthenticated } from "../Middleware/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, createGroup);
router.get("/", getGroups);
router.get("/my", isAuthenticated, getMyGroups);
router.post("/:id/join", isAuthenticated, joinGroup);
router.post("/:id/accept/:userId", isAuthenticated, acceptRequest);
router.post("/:id/leave", isAuthenticated, leaveGroup);
router.get("/:id/messages", isAuthenticated, getMessages);
router.delete("/:id/remove/:userId", isAuthenticated, removeMember);

export default router;
