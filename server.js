// Changed require → import (external modules)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Changed require → import (local files) 
// Added .js extension (mandatory in ESM)
import connectDB from "./src/config/db.js"
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js"


import tagsRoutes from "./src/routes/tagsRoutes.js";
import chapterRoutes from "./src/routes/chapterRoutes.js";



// (same as before)
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", authRoutes);
app.use("/api/book", bookRoutes)

app.use("/api/tags", tagsRoutes);

app.use("/api/chapters", chapterRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
