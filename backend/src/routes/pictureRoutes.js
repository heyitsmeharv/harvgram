import express from "express";
import { getPicture, pictures, createPictureEntry } from "../controllers/pictureController.js";

const router = express.Router();

router.get("/pictures", pictures);
router.get("/picture/{id}", getPicture);
router.post("/upload-image", createPictureEntry);

export default router;
