// Changed require → import
import Book from "../models/Book.js";

// Changed exports.function → export const
export const getNextRecordNumber = async () => {
  // Find the maximum record number directly without sorting
  const books = await Book.find();

  // If no books exist, start from 1.00
  if (books.length === 0) {
    return "1.00";
  }

  // Get the maximum record number from the existing books
  const maxNumber = Math.max(
    ...books.map((book) => parseFloat(book.recordNumber) || 0)
  );

  // Increment by 2.00 and return the next record number
  const nextNumber = (maxNumber + 2.0).toFixed(2);

  return nextNumber;
};
