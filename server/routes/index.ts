import express from "express";

import authRoutes from "./auth";
import meRoutes from "./me";
import tagsRoutes from "./tags";
import entriesRoutes from "./entries";
import statsRoutes from "./stats";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/me", meRoutes);
router.use("/tags", tagsRoutes);
router.use("/entries", entriesRoutes);
router.use("/stats", statsRoutes);

export default router;