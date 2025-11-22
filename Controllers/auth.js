import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { name, email, password, branch, year } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json({ message: "user already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
      branch,
      year
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.json({
      message: "user registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        branch: newUser.branch,
        year: newUser.year,
        role: newUser.role,
        profilePic: newUser.profilePic || "",
        bio: newUser.bio || "",
        clubsJoined: newUser.clubsJoined || []
      }
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "user not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.json({
      message: "login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        role: user.role,
        profilePic: user.profilePic || "",
        bio: user.bio || "",
        clubsJoined: user.clubsJoined || []
      }
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const u = req.user;
    res.json({
      id: u._id,
      name: u.name,
      email: u.email,
      branch: u.branch,
      year: u.year,
      role: u.role,
      profilePic: u.profilePic || "",
      bio: u.bio || "",
      clubsJoined: u.clubsJoined || []
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, branch, year, profilePic, bio } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, branch, year, profilePic, bio },
      { new: true }
    );

    if (!updated) return res.json({ message: "user not found" });

    res.json({
      message: "profile updated",
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        branch: updated.branch,
        year: updated.year,
        role: updated.role,
        profilePic: updated.profilePic || "",
        bio: updated.bio || "",
        clubsJoined: updated.clubsJoined || []
      }
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};
