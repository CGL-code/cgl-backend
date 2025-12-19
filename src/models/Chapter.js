    // Chapter.model.js
import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    // Parent link (recommended for safe joins)
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },

    // Book identity mirrors (optional but helpful for display/legacy)
    mBookNo: { type: String, required: true, trim: true, index: true },
    sBookNo: { type: String, required: true, trim: true, index: true },
    bookGroupNo: { type: String, required: true, trim: true, index: true },

    // Chapter identity inside the book
    chapNo: { type: Number, required: true, min: 1, index: true },

  // Chapter content
    dStructureCode: { type: String, required: true, trim: true }, // dropdown selection (CT, AT, etc.) 
    dsCodeText: { type: String, default: "", trim: true }, // the text written for that dropdown code


   /* chapterTitle: { type: String, required: true, trim: true },    
    chapterIntroduction: { type: String, default: "", trim: true },    */

    // Tracking for your “last record” concept
    mRecNo: { type: Number, default: 0, min: 0 },
    sRecNo: { type: Number, default: 0, min: 0 },

    // Status control
    status: { type: String, enum: ["DRAFT", "ACTIVE", "HOLD"], default: "DRAFT", index: true }
  },
  { timestamps: true }
);

// Uniqueness: a chapter number cannot repeat inside same book
ChapterSchema.index({ bookId: 1, chapNo: 1 }, { unique: true });

export default mongoose.model("Chapter", ChapterSchema);
  