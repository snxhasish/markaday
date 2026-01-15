import express from "express";
import jwt from "jsonwebtoken";
import Users from "../db/models/user";
import Entries from "../db/models/entry";

const router = express.Router();

// GET /profile/:username
router.get("/:username", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "User not found" });

        const { username } = req.params;
        if (!username) {
            return res
                .status(400)
                .json({ error: "Username is required." });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

        const isValidUser = await Users.exists({ email: payload.email });
        if (!isValidUser) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const profile = await Users.findOne(
            { username },
            { name: 1, username: 1, avatar_url: 1, tags: 1 }
        ).lean();

        if (!profile) {
            return res.status(404).json({ profile: null });
        }

        const allEntries = await Entries.find(
            { user_id: profile._id.toString() },
            { date: 1, tags: 1, mood_score: 1, note: 1 }
        ).lean();

        const formattedEntries = [];

        for (let i = 0; i < allEntries.length; i++) {
            const entry = allEntries[i];
            const tagsData = [];

            for (let j = 0; j < entry.tags.length; j++) {
                const currentTag = entry.tags[j];
                const tagData = profile.tags.find((t) => t._id?.toString() === currentTag);
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

        return res.status(200).json({
            profile: {
                id: profile._id.toString(),
                name: profile.name,
                username: profile.username,
                avatar_url: profile.avatar_url,
                tags: profile.tags,
            },
            entries: formattedEntries,
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
});

export default router;