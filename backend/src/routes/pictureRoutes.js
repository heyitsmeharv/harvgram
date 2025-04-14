import express from "express";
import { getPicture, getAllPictures, createPictureEntry, deletePictureEntry } from "../controllers/pictureController.js";

const router = express.Router();

router.get("/pictures", getAllPictures);
router.get("/picture/:id", getPicture);
router.post("/upload-image", createPictureEntry);
router.delete("/picture/:id", deletePictureEntry);

export default router;
