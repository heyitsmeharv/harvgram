import express from "express";
import { health } from "../controllers/healthController.js";

const router = express.Router();

router.post("/heath", health);

export default router;
