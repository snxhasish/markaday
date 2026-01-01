import express from "express";
import Entries from "../db/models/entry";
import jwt from "jsonwebtoken";
import Users from "../db/models/user";

const router = express.Router();

/**
 * GET /stats/tags-usage
 * Query params:
 *  - from=YYYY-MM-DD (optional)
 *  - to=YYYY-MM-DD   (optional)
 */
router.get("/tags", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

    const user = await Users.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ user: null });

    try {
        const userId = user._id.toString();

        const { from, to } = req.query;

        const match: any = { user_id: userId };

        if (from || to) {
            match.date = {};
            if (from) match.date.$gte = from;
            if (to) match.date.$lte = to;
        }

        const data = await Entries.aggregate([
            // 1️⃣ filter by user + date
            { $match: match },

            // 2️⃣ explode tags[]
            { $unwind: "$tags" },

            // 3️⃣ count tag usage per day
            {
                $group: {
                    _id: {
                        date: "$date",
                        tagId: "$tags"
                    },
                    count: { $sum: 1 }
                }
            },

            // 4️⃣ regroup by date
            {
                $group: {
                    _id: "$_id.date",
                    tags: {
                        $push: {
                            k: "$_id.tagId",
                            v: "$count"
                        }
                    }
                }
            },

            // 5️⃣ convert tags[] → object
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    tags: { $arrayToObject: "$tags" }
                }
            },

            // 6️⃣ sort chronologically
            { $sort: { date: 1 } }
        ]);

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export tag usage data" });
    }
});

export default router;
