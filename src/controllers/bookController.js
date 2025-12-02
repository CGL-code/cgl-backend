import Book from "../models/Book.js";
import Chapter from "../models/Chapter.js";
import { getNextRecordNumber } from "../services/book.service.js";
import slugify from "slugify";

// Create Book
export const createBook = async (req, res) => {
  try {
    const {
      auto,
      recordNumber,
      bookNumber,
      bookName,
      groupType,
      tagMainVersionId,
      tagVersionHId,
      tagVersionEId,
      briefIntroGroupType,
      briefIntroMainVersionId,
      briefIntroVersionHId,
      briefIntroVersionEId,
      briefIntroduction,
      authorNotes,
      status, // optional during creation
    } = req.body;

    let finalRecordNumber;
    if (auto) {
      finalRecordNumber = await getNextRecordNumber();
    } else {
      const manualRecord = parseFloat(recordNumber);
      if (isNaN(manualRecord)) {
        return res.status(400).json({ message: "Manual record number must be a valid number." });
      }

      const existingBook = await Book.findOne({ recordNumber: manualRecord.toFixed(2) });
      if (existingBook) {
        return res.status(400).json({ message: "This record number already exists." });
      }
      finalRecordNumber = manualRecord.toFixed(2);
    }

    const slug = slugify(bookName, { lower: true, strict: true });

    const newBook = new Book({
      recordNumber: finalRecordNumber,
      bookNumber,
      bookName,
      slug,
      groupType,
      tagMainVersionId,
      tagVersionHId,
      tagVersionEId,
      briefIntroGroupType,
      briefIntroMainVersionId,
      briefIntroVersionHId,
      briefIntroVersionEId,
      briefIntroduction,
      authorNotes,
      status: status && ["DRAFT", "ARCHIVE", "PUBLISHED"].includes(status) ? status : "DRAFT",
    });

    await newBook.save();
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get only book names
export const getBookNamesOnly = async (req, res) => {
  try {
    const bookNames = await Book.find().select("bookName -_id");
    res.status(200).json(bookNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get book by slug
export const getBookBySlug = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update book by slug
export const updateBook = async (req, res) => {
  try {
    const { bookName, status } = req.body;

    if (bookName) {
      req.body.slug = slugify(bookName, { lower: true, strict: true });
    }

    // Validate status if provided
    if (status && !["DRAFT", "ARCHIVE", "PUBLISHED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBook = await Book.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete book by slug
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({ slug: req.params.slug });
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get books with chapters
export const getBooksWithChapters = async (req, res) => {
  try {
    const books = await Book.find({}).lean();
    const chapters = await Chapter.find({}).lean();

    const chaptersMap = chapters.reduce((acc, chapter) => {
      if (!acc[chapter.bookId]) acc[chapter.bookId] = [];
      acc[chapter.bookId].push(chapter);
      return acc;
    }, {});

    const booksWithChapters = books.map((book) => ({
      ...book,
      chapters: chaptersMap[book._id] || [],
    }));

    res.status(200).json(booksWithChapters);
  } catch (error) {
    console.error("Error fetching books with chapters:", error);
    res.status(500).json({ message: "Server error" });
  }
};
