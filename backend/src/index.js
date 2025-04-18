import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pictureRoutes from "./routes/pictureRoutes.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ["http://localhost:5173", "https://harvgram.co.uk"], methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));

app.use("/auth", authRoutes);
app.use("/auth", pictureRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});