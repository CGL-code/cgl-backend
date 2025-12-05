// backend/src/models/book.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Book Schema (NEW – CGL)
 * - Focused on actual books only.
 * - No recordNo, no legacy bookNo.
 * - Uses M.BookNo + S.BookNo as the primary sequence keys.
 */

const BookSchema = new Schema(
  {
    // ---- How this book was created (for reference only) ----
    // "regular" = normal planned book
    // "deliberate" = inserted into existing sequence
    // "system" / "import" reserved for future
    typeOfEntry: {
      type: String,
      enum: ["regular", "deliberate", "system", "import"],
      default: "regular",
    },

    // ---- New numbering system ----
    // M.BookNo and S.BookNo are the heart of your sequence logic.
    mBookNo: {
      type: Number,
      required: true,
      index: true,
    },
    sBookNo: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },

    // ---- Core content ----
    title: {
      type: String,
      required: true,
      trim: true,
    },
    introParas: {
      type: String,
      default: "",
      trim: true,
    },

    // ---- Grouping / classification ----
    bookGroupNo: {
      type: Number,
      default: 0,
    },
    btCode: {
      type: String,
      trim: true,
      default: "CGL",
    },

    // ---- Flags / tags ----
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ---- Meta ----
    meta: {
      createdBy: { type: String, default: "" },
      updatedBy: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual label "M.S" (example: 12.5)
BookSchema.virtual("bookLabel").get(function bookLabel() {
  const m = Number.isFinite(this.mBookNo) ? this.mBookNo : 0;
  const s = Number.isFinite(this.sBookNo) ? this.sBookNo : 0;
  return `${m}.${s}`;
});

// Ensure (M,S) pair is unique across all books.
BookSchema.index({ mBookNo: 1, sBookNo: 1 }, { unique: true, sparse: true });

// Optional: clean integer values
BookSchema.pre("save", function onSave(next) {
  if (typeof this.mBookNo === "number") this.mBookNo = Math.trunc(this.mBookNo);
  if (typeof this.sBookNo === "number") this.sBookNo = Math.trunc(this.sBookNo);
  if (typeof this.bookGroupNo === "number")
    this.bookGroupNo = Math.trunc(this.bookGroupNo);
  next();
});

const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
export default Book;
