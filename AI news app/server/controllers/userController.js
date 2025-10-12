import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// For file deletion (when avatar is replaced)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET profile (protected)
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    return res.json({
      _id: user._id,
      fullName: user.name,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
      avatarUrl: user.avatar
        ? `${process.env.BASE_URL || ""}/uploads/${user.avatar}`
        : null,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE profile (protected)
export const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { fullName, email, phone, bio, password } = req.body;

    // Handle avatar upload (if new one uploaded)
    if (req.file) {
      // delete old avatar if exists
      if (user.avatar) {
        const oldPath = path.join(__dirname, "../uploads", user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.avatar = req.file.filename;
    }

    if (fullName) user.name = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (bio) user.bio = bio.trim();

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.trim();
    }

    if (password?.trim()) {
      user.password = password;
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      fullName: updated.name,
      email: updated.email,
      phone: updated.phone || "",
      bio: updated.bio || "",
      avatarUrl: updated.avatar
        ? `${process.env.BASE_URL || ""}/uploads/${updated.avatar}`
        : null,
      message: "Profile updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
