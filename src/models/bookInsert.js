import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * BookInsert Schema
 * - Captures deliberate insertion planning
 * - Acts as an audit log (NOT an actual book)
 */

const BookInsertSchema = new Schema(
  {
    // ---- Reference book (chosen by user) ----
    refMBookNo: {
      type: Number,
      required: true,
    },
    refSBookNo: {
      type: Number,
      required: true,
    },

    // Reference book title (for history / clarity)
    refBookTitle: {
      type: String,
      trim: true,
    },

    // ---- Calculated new numbers (system generated) ----
    mBookNo: {
      type: Number,
      required: true,
    },
    sBookNo: {
      type: Number,
      required: true,
    },

    // ---- New book info ----
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Reason for insertion
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure numeric fields are integers
BookInsertSchema.pre("save", function (next) {
  ["refMBookNo", "refSBookNo", "mBookNo", "sBookNo"].forEach((field) => {
    if (typeof this[field] === "number") {
      this[field] = Math.trunc(this[field]);
    }
  });
  next();
});

const BookInsert =
  mongoose.models.BookInsert ||
  mongoose.model("BookInsert", BookInsertSchema);

export default BookInsert;
