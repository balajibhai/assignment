import { Router } from "express";
import Profile from "../models/Profile.js";
import { serializeProfile } from "../serializers.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: 1 });
    res.json(profiles.map(serializeProfile));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Profile name is required" });
    }
    const profile = await Profile.create({ name: name.trim() });
    res.status(201).json(serializeProfile(profile));
  } catch (err) {
    next(err);
  }
});

export default router;
