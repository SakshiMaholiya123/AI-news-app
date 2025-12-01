import User from "../models/User.js";
import Summary from "../models/Summary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET profile (protected)
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
      avatar: user.avatar || null, // ✅ Return just filename
    });
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE profile (protected)
export const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, phone, bio } = req.body;

    // ✅ Handle avatar upload
    if (req.file) {
      if (user.avatar) {
        const oldPath = path.join(__dirname, "../uploads", user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.avatar = req.file.filename;
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone || "",
      bio: updated.bio || "",
      avatar: updated.avatar || null, // ✅ Return just filename
    });
  } catch (err) {
    next(err);
  }
};

// ✅ CHANGE PASSWORD (protected)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Please provide both current and new password" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters" 
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE ACCOUNT (protected)
export const deleteAccount = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar) {
      const avatarPath = path.join(__dirname, "../uploads", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await Summary.deleteMany({ user: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
