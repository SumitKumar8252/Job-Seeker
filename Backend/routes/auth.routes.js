import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

export default router;