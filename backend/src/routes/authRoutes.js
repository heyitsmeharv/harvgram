import express from "express";
import { login, forceChangePassword, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/respond-to-challenge", forceChangePassword);
router.post("/refresh-token", refreshToken)

export default router;
