import Chapter from "../models/Chapter.js";
import Book from "../models/book.js";

/* =========================================================
   Helper: Get Next Chapter Number
   ========================================================= */
const getNextChapterNo = async (bookId) => {
  const last = await Chapter.findOne({ bookId })
    .sort({ chapNo: -1 })
    .lean();

  if (!last) return 1;
  return last.chapNo + 1;
};

/* =========================================================
   Helper: Get Next Record Numbers
   ========================================================= */
const getNextRecordNumbers = async (bookId, chapNo) => {
  const last = await Chapter.findOne({ bookId, chapNo })
    .sort({ mRecNo: -1, sRecNo: -1 })
    .lean();

  if (!last) {
    return { mRecNo: 10, sRecNo: 1 };
  }

  return {
    mRecNo: last.mRecNo + 10,
    sRecNo: 1,
  };
};

/* =========================================================
   WINDOW 1: Create Chapter (BT + CT)
   ========================================================= */
export const createChapterWindow1 = async (req, res) => {
  try {
    const {
      bookId,
      chapNo, // optional (admin override)
      chapterTitle,
    } = req.body;

    if (!bookId || !chapterTitle) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const finalChapNo = chapNo
      ? Number(chapNo)
      : await getNextChapterNo(bookId);

    // Prevent duplicate chapter
    const exists = await Chapter.findOne({ bookId, chapNo: finalChapNo });
    if (exists) {
      return res.status(400).json({ error: "Chapter already exists" });
    }

    // ---- BT record ----
    const BT = new Chapter({
      bookId,
      mBookNo: book.mBookNo,
      sBookNo: book.sBookNo,
      bookGroupNo: book.bookGroupNo,
      chapNo: finalChapNo,
      dStructureCode: "BT",
      dsCodeText: { type: "text", value: book.title },
      mRecNo: 10,
      sRecNo: 1,
      status: "IN_PROGRESS",
    });

    // ---- CT record ----
    const CT = new Chapter({
      bookId,
      mBookNo: book.mBookNo,
      sBookNo: book.sBookNo,
      bookGroupNo: book.bookGroupNo,
      chapNo: finalChapNo,
      dStructureCode: "CT",
      dsCodeText: { type: "text", value: chapterTitle },
      mRecNo: 10,
      sRecNo: 2,
      status: "IN_PROGRESS",
    });

    await BT.save();
    await CT.save();

    res.json({
      message: "Chapter Window 1 saved",
      chapNo: finalChapNo,
      chapNoFormatted: String(finalChapNo).padStart(3, "0"),
    });
  } catch (err) {
    console.error("createChapterWindow1:", err.message);
    res.status(500).json({ error: "Failed to save chapter window 1" });
  }
};

/* =========================================================
   WINDOW 2: Save DSCode Record
   ========================================================= */
export const saveChapterRecord = async (req, res) => {
  try {
    const {
      bookId,
      chapNo,
      dStructureCode,
      dsCodeText, // TipTap JSON
    } = req.body;

    if (!bookId || !chapNo || !dStructureCode || !dsCodeText) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    if (["BT", "CT"].includes(dStructureCode)) {
      return res.status(400).json({
        error: "BT / CT cannot be created in Window 2",
      });
    }

    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const { mRecNo, sRecNo } = await getNextRecordNumbers(bookId, chapNo);

    const record = new Chapter({
      bookId,
      mBookNo: book.mBookNo,
      sBookNo: book.sBookNo,
      bookGroupNo: book.bookGroupNo,
      chapNo,
      dStructureCode,
      dsCodeText,
      mRecNo,
      sRecNo,
      status: "IN_PROGRESS",
    });

    await record.save();

    res.json({
      message: "Chapter record saved",
      record,
      recordNo: `${String(mRecNo).padStart(4, "0")}-${String(sRecNo).padStart(2, "0")}`,
    });
  } catch (err) {
    console.error("saveChapterRecord:", err.message);
    res.status(500).json({ error: "Failed to save chapter record" });
  }
};

/* =========================================================
   LIST Chapter Data Table
   ========================================================= */
export const listChapterData = async (req, res) => {
  try {
    const { bookId, chapNo } = req.params;

    const rows = await Chapter.find({ bookId, chapNo })
      .sort({ mRecNo: 1, sRecNo: 1 })
      .lean();

    res.json(
      rows.map((r) => ({
        ...r,
        chapNoFormatted: String(r.chapNo).padStart(3, "0"),
        recordNo: `${String(r.mRecNo).padStart(4, "0")}-${String(r.sRecNo).padStart(2, "0")}`,
      }))
    );
  } catch (err) {
    console.error("listChapterData:", err.message);
    res.status(500).json({ error: "Failed to list chapter data" });
  }
};

/* =========================================================
   FINALISE Chapter
   ========================================================= */
export const finaliseChapter = async (req, res) => {
  try {
    const { bookId, chapNo } = req.params;

    await Chapter.updateMany(
      { bookId, chapNo },
      { status: "FINALISED" }
    );

    res.json({ message: "Chapter finalised successfully" });
  } catch (err) {
    console.error("finaliseChapter:", err.message);
    res.status(500).json({ error: "Failed to finalise chapter" });
  }
};

/* =========================================================
   DELETE Chapter
   ========================================================= */
export const deleteChapter = async (req, res) => {
  try {
    const { bookId, chapNo } = req.params;

    await Chapter.deleteMany({ bookId, chapNo });

    res.json({ message: "Chapter deleted completely" });
  } catch (err) {
    console.error("deleteChapter:", err.message);
    res.status(500).json({ error: "Failed to delete chapter" });
  }
};
