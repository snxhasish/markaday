import express from "express";
import Users from "../db/models/user";
import jwt from "jsonwebtoken";
const router = express.Router();

// GET /tags
router.get("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ user: null });

    res.status(200).json({
        tags: user.tags.map(tag => ({
            label: tag.label,
            color: tag.color,
            id: tag._id
        }))
    });
});

// POST /tags/create
router.post("/create", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ user: null });

    const { label, color } = req.body;
    if (!label || !color) {
        return res.status(400).json({ error: "Label and color are required." });
    }

    user.tags.push({ label, color });
    await user.save();

    res.status(200).json({ tags: user.tags.map(tag => ({ label: tag.label, color: tag.color, id: tag._id })) });
});

export default router;