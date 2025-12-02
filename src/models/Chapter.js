// Changed require → import
import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    // Reference to Book
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    recordNumber: {
      type: String,
      required: true,
    },
    bookNumber: {
      type: String,
      required: true,
    },

    // 📘 Chapter Info
    chapterNumber: {
      type: String, // Format: CHNo 1.00, CHNo 2.00, etc.
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
    },

    // 🔵 Chapter Tag Info
    chapterTag: {
      groupType: {
        type: String,
        required: true,
      },
      tagMainVersionId: {
        type: String,
        required: true,
      },
      tagVersionHId: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000,
      },
      tagVersionEId: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10000,
      },
    },

    // Chapter Content Tag Info
    contentTag: {
      groupType: {
        type: String,
        required: true,
      },
      tagMainVersionId: {
        type: String,
        required: true,
      },
      tagVersionHId: {
        type: String,
        minlength: 1,
        maxlength: 10000,
      },
      tagVersionEId: {
        type: String,
        minlength: 1,
        maxlength: 10000,
      },
    },

    // Chapter Content Text
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Changed module.exports → export default
export default mongoose.model("Chapter", chapterSchema);
