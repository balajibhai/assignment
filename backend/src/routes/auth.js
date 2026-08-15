import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return res.status(500).json({ error: "Authentication is not configured" });
  }

  if (
    typeof username !== "string" ||
    username !== expectedUsername ||
    password !== expectedPassword
  ) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? "12h";
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn });
  res.json({ token, expiresIn });
});

export default router;
