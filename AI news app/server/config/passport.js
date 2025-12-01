import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("❌ Missing Google OAuth client ID or client secret");
  process.exit(1); // Exit if critical env vars are missing
}

console.log("🔍 Google OAuth Configuration:");
console.log("Client ID:", "✅ Loaded");
console.log("Client Secret:", "✅ Loaded");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }
        console.log("✅ Google Profile received:", email);

        let user = await User.findOne({ email });

        if (user) {
          console.log("✅ Existing user logged in:", user.email);
          return done(null, user);
        }

        const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

        user = await User.create({
          name: profile.displayName || "Unnamed User",
          email,
          password: randomPassword,
          avatar: profile.photos?.[0]?.value || "",
        });

        console.log("✅ New user registered via Google:", user.email);
        done(null, user);
      } catch (error) {
        console.error("❌ Google OAuth Error:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
