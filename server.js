import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import tagsRoutes from "./src/routes/tagsRoutes.js";
import chapterRoutes from "./src/routes/chapterRoutes.js";
import configRoutes from "./src/routes/configRoutes.js";   // ✅ ADDED
import dscodeRoutes from "./src/routes/dscode.routes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/config", configRoutes);   // ✅ ADDED
app.use("/api/dscode", dscodeRoutes);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
