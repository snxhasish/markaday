import express from "express";
import Users from "../db/models/user";
import jwt from "jsonwebtoken";
import { getTodayInTimezone } from "../lib/date";
import Entries from "../db/models/entry";
const router = express.Router();

// GET /me
router.get("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ user: null });

    const date = getTodayInTimezone(user.timezone);
    const todaysEntry = await Entries.findOne({ user_id: user._id.toString(), date });

    res.status(200).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
            avatar_url: user.avatar_url
        },
        todays_entry: {
            date,
            tags: todaysEntry?.tags,
            mood_score: todaysEntry?.mood_score,
            note: todaysEntry?.note
        }
    });
});

export default router;