// Changed require → import
import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema(
  {
    dataTypeCode: {
      type: String,
      required: true,
      enum: [
        "BKN",  // Book Name
        "BKT",  // Book Text
        "BKT_para",  // Book Text Additional Para
        "BKT_Last",  // Book Text Additional Para Last Para
        "CHNo",  // Chapter No
        "CN",  // Chapter Name
        "CH",  // Chapter Heading
        "SHRed",  // Sub Heading 1 Red
        "SHBlue",  // Sub Heading 1 Blue
        "SH2",  // Sub Heading 2
        "SH3",  // Sub Heading 3
        "SH4",  // Sub Heading 4
        "LT1",  // Listings Type 1
        "LT2",  // Listings Type 2
        "LT3",  // Listings Type 3
        "LT4",  // Listings Type 4
        "COM",  // Comments
        "Slides"  // Slides
      ],
      index: true,
    },
    tagMainId: {
      type: String,
      unique: true,
      required: false,
    },
    openingTag: {
      type: String,
      required: true,
    },
    closingTag: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Auto-incrementing tagMainId within each dataTypeCode group
tagsSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const prefix = this.dataTypeCode;

  try {
    const lastTag = await mongoose
      .model("Tags")
      .findOne({ dataTypeCode: prefix })
      .sort({ createdAt: -1 })
      .select("tagMainId")
      .lean();

    let newIdNumber;

    if (lastTag) {
      const lastNumber = parseFloat(lastTag.tagMainId.replace(prefix, ""));
      newIdNumber = (lastNumber + 2).toFixed(2);
    } else {
      newIdNumber = "1.00";
    }

    this.tagMainId = `${prefix}${newIdNumber}`;
    next();
  } catch (error) {
    next(error);
  }
});

// Changed module.exports → export default
export default mongoose.model("Tags", tagsSchema);
