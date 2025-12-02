import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    recordNumber: { type: String, required: true },
    bookNumber: { type: String, required: true },
    bookName: { type: String, required: true },

    // Slug for SEO/URLs
    slug: { type: String, required: true, unique: true },

    // Status field
    status: {
      type: String,
      enum: ["DRAFT", "ARCHIVE", "PUBLISHED"],
      default: "DRAFT",
    },

    // Book tags
    groupType: { type: String, required: true },
    tagMainVersionId: { type: String, required: true },
    tagVersionHId: { type: String, required: true, minlength: 1, maxlength: 10000 },
    tagVersionEId: { type: String, required: true, minlength: 1, maxlength: 10000 },

    // Brief introduction info
    briefIntroGroupType: { type: String },
    briefIntroMainVersionId: { type: String },
    briefIntroVersionHId: { type: String, minlength: 1, maxlength: 10000 },
    briefIntroVersionEId: { type: String, minlength: 1, maxlength: 10000 },

    // Array of paragraph texts
    briefIntroduction: [{ paragraph: { type: String } }],

    // Author notes
    authorNotes: [{ point: { type: String } }],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
