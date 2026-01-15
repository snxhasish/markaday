import express from "express";
import Users from "../db/models/user";
import jwt from "jsonwebtoken";
import { getTodayInTimezone } from "../lib/date";
import Entries from "../db/models/entry";
import { isValidDay, isValidTimeZone } from "../lib/tz";
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
            id: user._id.toString(),
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

// POST /me
router.post("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "User not found" });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const { name, username, avatar_url, tz, week_start } = req.body;

    if (!name && !username && !avatar_url && !tz && !week_start) return res.status(400).json({ error: "tf u wanna update duh" });
    if (name && typeof name !== "string") return res.status(400).json({ error: "Name must be a valid string." });
    if (username && typeof username !== "string") return res.status(400).json({ error: "Username must be a valid string." });
    if (avatar_url && typeof avatar_url !== "string") return res.status(400).json({ error: "Avatar URL must be a valid string." });
    if (tz && typeof tz !== "string") return res.status(400).json({ error: "Timezone must be a valid string." });
    if (week_start && typeof week_start !== "string") return res.status(400).json({ error: "Week start must be a valid string." });

    if (name && name?.length > 50) return res.status(400).json({ error: "Name must not be longer than 50 characters." });
    if (username && username?.length > 32) return res.status(400).json({ error: "Name must not be longer than 32 characters." });
    if (tz && isValidTimeZone(tz) !== true) return res.status(400).json({ error: "Invalid timezone." });
    if (tz && isValidDay(week_start) !== true) return res.status(400).json({ error: "Invalid week start day." });

    if (name) user.name = name;
    if (username) {
        const unameExists = await Users.findOne({ username });
        if (unameExists && unameExists.username === username) return;
        user.username = username;
    }
    if (avatar_url) user.avatar_url = avatar_url;
    if (tz) user.timezone = tz;
    if (week_start) user.week_start = week_start;

    user.save();

    res.status(200).json({ success: "Profile updated." });
});

export default router;