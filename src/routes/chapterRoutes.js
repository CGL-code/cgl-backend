import express from "express";
import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
  getChapterCountByBookId,
} from "../controllers/chapterController.js";

const router = express.Router();

// ✅ Create Chapter
router.post("/", createChapter);

// ✅ Get All Chapters (optionally by bookId)
router.get("/", getChapters);

// ✅ Get Single Chapter by ID
router.get("/:id", getChapterById);

// ✅ Update Chapter
router.put("/:id", updateChapter);

// ✅ Delete Chapter
router.delete("/:id", deleteChapter);

// ✅ Chapter count by bookId
router.get("/count/:bookId", getChapterCountByBookId);

export default router;
