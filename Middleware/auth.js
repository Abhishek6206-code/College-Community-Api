import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  const token = req.header("Auth");
  if (!token) return res.json("login first");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.json({ message: "user not exist" });

    req.user = user;
    next();
  } catch (err) {
    res.json({ message: "invalid token" });
  }
};
