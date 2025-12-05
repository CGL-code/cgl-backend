// backend/src/models/bookInsert.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * BookInsert Schema (v2 – simplified)
 * - Tool to capture deliberate insertion of a missing book.
 * - Not part of regular day-to-day book entry.
 * - User only chooses reference book; system computes new M/S numbers.
 */

const BookInsertSchema = new Schema(
  {
    // ---- Reference point in existing list (user chooses this) ----
    // The existing book AFTER which we are inserting.
    refMBookNo: {
      type: Number,
      required: true,
    },
    refSBookNo: {
      type: Number,
      required: true,
    },

    // ---- Resulting new book number (system fills this, NOT the user) ----
    // These are calculated by backend after Save1.
    mBookNo: {
      type: Number,
      required: true,
    },
    sBookNo: {
      type: Number,
      required: true,
    },

    // ---- Core insert info (minimal) ----
    // Title is captured here so the insert record is self-explanatory.
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt (for history)
  }
);

// Ensure numeric fields are clean integers
BookInsertSchema.pre("save", function onSave(next) {
  ["refMBookNo", "refSBookNo", "mBookNo", "sBookNo"].forEach((field) => {
    if (typeof this[field] === "number") {
      this[field] = Math.trunc(this[field]);
    }
  });
  next();
});

const BookInsert =
  mongoose.models.BookInsert || mongoose.model("BookInsert", BookInsertSchema);

export default BookInsert;
