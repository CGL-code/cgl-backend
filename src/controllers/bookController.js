import Book from "../models/book.js";
import BookInsert from "../models/bookInsert.js";
import slugify from "slugify";

/* =========================================================
   Helper: Get Next Regular Numbers
   ========================================================= */
const getNextRegularNumbers = async () => {
  const lastBook = await Book.findOne({ typeOfEntry: "regular" })
    .sort({ mBookNo: -1, sBookNo: -1 })
    .lean();

  if (!lastBook) {
    return { mBookNo: 1, sBookNo: 1 };
  }

  return {
    mBookNo: lastBook.mBookNo + 2,
    sBookNo: lastBook.sBookNo + 5,
  };
};

/* =========================================================
   Helper: Calculate Deliberate Insert Numbers
   ========================================================= */
const calculateInsertNumbers = async (refMBookNo, refSBookNo) => {
  const refBook = await Book.findOne({
    mBookNo: refMBookNo,
    sBookNo: refSBookNo,
  }).lean();

  if (!refBook) {
    throw new Error("Reference book not found.");
  }

  const newMBookNo = refBook.mBookNo + 1;
  const newSBookNo = refBook.sBookNo + 1;

  const nextBook = await Book.findOne({
    $or: [
      { mBookNo: { $gt: refMBookNo } },
      {
        mBookNo: refMBookNo,
        sBookNo: { $gt: refSBookNo },
      },
    ],
  })
    .sort({ mBookNo: 1, sBookNo: 1 })
    .lean();

  let warning = false;
  if (
    nextBook &&
    (newMBookNo > nextBook.mBookNo ||
      (newMBookNo === nextBook.mBookNo &&
        newSBookNo >= nextBook.sBookNo))
  ) {
    warning = true;
  }

  return {
    warning,
    mBookNo: newMBookNo,
    sBookNo: newSBookNo,
    refBookTitle: refBook.title,
  };
};

/* =========================================================
   SAVE 01 – Deliberate Insert Plan
   ========================================================= */
export const saveInsertPlan = async (req, res) => {
  try {
    const {
      refMBookNo,
      refSBookNo,
      title,
      reason,
      refBookTitle,
    } = req.body;

    if (
      refMBookNo === undefined ||
      refSBookNo === undefined ||
      !title
    ) {
      return res.status(400).json({
        error: "Required fields missing",
      });
    }

    const insertCalc = await calculateInsertNumbers(
      refMBookNo,
      refSBookNo
    );

    const insertPlan = new BookInsert({
      refMBookNo,
      refSBookNo,
      refBookTitle: refBookTitle || insertCalc.refBookTitle,
      mBookNo: insertCalc.mBookNo,
      sBookNo: insertCalc.sBookNo,
      title,
      reason,
    });

    await insertPlan.save();

    res.json({
      insertPlanId: insertPlan._id,
      mBookNo: insertCalc.mBookNo,
      sBookNo: insertCalc.sBookNo,
      title,
      warning: insertCalc.warning,
    });
  } catch (err) {
    console.error("Error in saveInsertPlan:", err.message);
    res.status(500).json({
      error: err.message || "Failed to calculate insert location",
    });
  }
};

/* =========================================================
   SAVE 02 – Save Book
   ========================================================= */
export const saveBook = async (req, res) => {
  try {
    const {
      typeOfEntry,
      mBookNo,
      sBookNo,
      bookGroupNo,
      title,
      introParas,
    } = req.body;

    if (
      mBookNo === undefined ||
      sBookNo === undefined ||
      !title
    ) {
      return res.status(400).json({
        error: "Required fields missing",
      });
    }

    if (introParas && introParas.split(" ").length > 1000) {
      return res.status(400).json({
        error: "Introduction cannot exceed 1000 words",
      });
    }

    const existingBook = await Book.findOne({
      mBookNo,
      sBookNo,
    });

    if (existingBook) {
      return res.status(400).json({
        error: "M/S Book No already exists",
      });
    }

    let baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await Book.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const book = new Book({
      typeOfEntry: typeOfEntry || "regular",
      mBookNo: Number(mBookNo),
      sBookNo: Number(sBookNo),
      bookGroupNo: Number(bookGroupNo) || 0,
      title,
      introParas: introParas || "",
      slug,
    });

    await book.save();

    res.json({
      message: "Book saved successfully",
      book,
    });
  } catch (err) {
    console.error("Error in saveBook:", err.message);
    res.status(500).json({
      error: "Failed to save book",
    });
  }
};

/* =========================================================
   Get Next Regular Numbers
   ========================================================= */
export const getNextRegular = async (req, res) => {
  try {
    const next = await getNextRegularNumbers();
    res.json(next);
  } catch (err) {
    console.error("Error in getNextRegular:", err.message);
    res.status(500).json({
      error: "Failed to get next regular numbers",
    });
  }
};

/* =========================================================
   List All Books
   ========================================================= */
export const listBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ mBookNo: 1, sBookNo: 1 })
      .lean();

    res.json(books);
  } catch (err) {
    console.error("Error in listBooks:", err.message);
    res.status(500).json({
      error: "Failed to list books",
    });
  }
};
