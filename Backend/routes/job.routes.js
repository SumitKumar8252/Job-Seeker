import express from "express";
import { createJob, getJobs } from "../controllers/job.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Admin only
router.post("/create", verifyToken, isAdmin, createJob);

// All logged-in users
router.get("/", verifyToken, getJobs);

export default router;