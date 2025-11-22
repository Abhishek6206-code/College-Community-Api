import express from "express";
import { signup, login, getProfile, updateProfile } from "../Controllers/auth.js";
import { isAuthenticated } from "../Middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);

export default router;