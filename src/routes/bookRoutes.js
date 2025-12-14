import express from "express";
import {
  saveInsertPlan,
  saveBook,
  getNextRegular,
  listBooks,
} from "../controllers/bookController.js";

const router = express.Router();

// Deliberate insert plan
router.post("/book-inserts/plan", saveInsertPlan);

// Save book (regular or insert)
router.post("/books", saveBook);

// Get next regular M/S numbers
router.get("/books/next-regular", getNextRegular);

// Optional: List all books
router.get("/books", listBooks);

export default router;
