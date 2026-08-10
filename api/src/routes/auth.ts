import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const router = express.Router();

function signToken(user: IUser): string {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "email, password, and displayName are all required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "password must be at least 8 characters long" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists" });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, displayName, passwordHash });

    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: "Failed to register user" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: "Failed to log in" });
  }
});

export default router;
