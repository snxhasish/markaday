import express from "express";
import Users from "../db/models/user";
const router = express.Router();

// GET /username/availability
router.get("/availability", async (req, res) => {
    const { username } = req.query;
    const exists = await Users.exists({ username });

    if (exists) res.status(400).json({ available: false });
    else res.status(200).json({ available: false });
});

export default router;