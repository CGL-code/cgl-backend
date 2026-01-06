import express from "express";
import {
  createChapterWindow1,
  saveChapterRecord,
  listChapterData,
  finaliseChapter,
  deleteChapter,
} from "../controllers/chapterController.js";

const router = express.Router();

/* Window 1 */
router.post("/chapters/window1", createChapterWindow1);

/* Window 2 */
router.post("/chapters/record", saveChapterRecord);

/* View Chapter Data Table */
router.get("/chapters/:bookId/:chapNo", listChapterData);

/* Finalise */
router.put("/chapters/:bookId/:chapNo/finalise", finaliseChapter);

/* Delete */
router.delete("/chapters/:bookId/:chapNo", deleteChapter);

export default router;
