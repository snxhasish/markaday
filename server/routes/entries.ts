import express from "express";
import Users from "../db/models/user";
import jwt from "jsonwebtoken";
import Entries, { DayEntry } from "../db/models/entry";
import { getTodayInTimezone } from "../lib/date";
const router = express.Router();

// GET /entries
router.get("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ user: null });

    const allEntries = await Entries.find({ user_id: user._id.toString() });
    const formattedEntries = [];

    for (let i = 0; i < allEntries.length; i++) {
        const entry = allEntries[i];
        const tagsData = [];

        for (let j = 0; j < entry.tags.length; j++) {
            const currentTag = entry.tags[j];
            const tagData = user.tags.find((t) => t._id?.toString() === currentTag);
            if (tagData) tagsData.push(tagData);
        }

        formattedEntries.push({
            date: entry.date,
            tags: tagsData,
            mood_score: entry.mood_score ?? null,
            note: entry.note,
            created_at: entry.createdAt,
            updated_at: entry.updatedAt
        });
    }

    res.status(200).json({
        entries: formattedEntries
    });
});

// POST /entries/create
router.post("/create", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ user: null });

    const date = getTodayInTimezone(user.timezone);
    const exists = await Entries.findOne({ user_id: user._id.toString(), date });

    if (exists && exists.date === date) return res.status(400).json({ error: "You have already created today's entry." });

    const { tags, notes } = req.body;
    if (!tags) return res.status(400).json({ error: "Tag(s) are required." });
    if (!Array.isArray(tags) || tags.length < 1) return res.status(400).json({ error: "At least one tag is required." });
    if (notes && typeof notes !== "string") return res.status(400).json({ error: "Notes must be a valid string" });
    if (notes && notes.length > 500) return res.status(400).json({ error: "Notes must be less than 500 characters in length" });

    const validTags = [];

    for (let i = 0; i < tags.length; i++) {
        const tag_id: string = tags[i];
        const tagExists = user.tags.findIndex((t) => t._id?.toString() === tag_id);
        if (tagExists >= 0) {
            validTags.push(tag_id);
        }
    }

    console.log(validTags, tags);

    Entries.create({
        user_id: user._id.toString(),
        date,
        tags: validTags,
        note: {
            content: notes ?? "",
            is_private: true
        }
    })
        .then((data) => {
            res.status(201).json({
                date: data.date,
                tags: data.tags,
                mood_score: data.mood_score ?? null,
                note: data.note
            });
        })
        .catch((e) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
});

export default router;