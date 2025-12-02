// Converted require → import
import express from "express";
import {
  createBook,
  getAllBooks,
  getBookNamesOnly,
  getBookBySlug,
  updateBook,
  deleteBook,
  getBooksWithChapters,
} from "../controllers/bookController.js";

const router = express.Router();

// Routes
router.get("/with-chapters", getBooksWithChapters);
router.post("/create", createBook);
router.get("/list", getAllBooks);
router.get("/names", getBookNamesOnly);
router.get("/:slug", getBookBySlug); // using slug instead of id
router.put("/update/:slug", updateBook); // using slug
router.delete("/delete/:slug", deleteBook); // using slug

export default router;
