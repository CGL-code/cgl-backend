import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    typeOfEntry: {
      type: String,
      enum: ["regular", "deliberate", "system", "import"],
      default: "regular",
    },
    insertPlanId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "BookInsert",
},

    mBookNo: { type: Number, required: true, index: true },
    sBookNo: { type: Number, required: true, default: 0, index: true },
    title: { type: String, required: true, trim: true },
    introParas: { type: String, default: "", trim: true },
    bookGroupNo: { type: Number, default: 0 },
    btCode: { type: String, trim: true, default: "CGL" },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
    slug: { type: String, unique: true, sparse: true },
    meta: { createdBy: { type: String, default: "" }, updatedBy: { type: String, default: "" } },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookSchema.virtual("bookLabel").get(function () {
  return `${this.mBookNo}.${this.sBookNo}`;
});

BookSchema.index({ mBookNo: 1, sBookNo: 1 }, { unique: true, sparse: true });

// Pre-save hook to generate slug
BookSchema.pre("save", async function (next) {
  if (typeof this.mBookNo === "number") this.mBookNo = Math.trunc(this.mBookNo);
  if (typeof this.sBookNo === "number") this.sBookNo = Math.trunc(this.sBookNo);
  if (typeof this.bookGroupNo === "number") this.bookGroupNo = Math.trunc(this.bookGroupNo);

  if (!this.slug && this.title) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    while (await mongoose.models.Book.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  next();
});

const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
export default Book;
