import express from "express";

import authRoutes from "./auth";
import meRoutes from "./me";
import tagsRoutes from "./tags";
import entriesRoutes from "./entries";
import statsRoutes from "./stats";
import usernameRoutes from "./username";
import profileRoutes from "./profile";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/me", meRoutes);
router.use("/tags", tagsRoutes);
router.use("/entries", entriesRoutes);
router.use("/stats", statsRoutes);
router.use("/username", usernameRoutes);
router.use("/profile", profileRoutes);

export default router;