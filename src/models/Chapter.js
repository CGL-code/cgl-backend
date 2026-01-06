import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    // Parent
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    // Book identity mirrors
    mBookNo: { type: Number, required: true, index: true },
    sBookNo: { type: Number, required: true, index: true },
    bookGroupNo: { type: Number, required: true, index: true },

    // Chapter number (001,010 handled in UI)
    chapNo: { type: Number, required: true, min: 1, index: true },

    // DSCode record
    dStructureCode: { type: String, required: true, trim: true },
    dsCodeText: { type: Object, required: true }, // TipTap JSON

    // Record tracking
    mRecNo: { type: Number, required: true },
    sRecNo: { type: Number, required: true },

    status: {
      type: String,
      enum: ["DRAFT", "IN_PROGRESS", "FINALISED"],
      default: "DRAFT",
      index: true,
    },
  },
  { timestamps: true }
);

// Unique chapter per book
ChapterSchema.index({ bookId: 1, chapNo: 1 });

// Unique record inside chapter
ChapterSchema.index(
  { bookId: 1, chapNo: 1, mRecNo: 1, sRecNo: 1 },
  { unique: true }
);

export default mongoose.model("Chapter", ChapterSchema);
