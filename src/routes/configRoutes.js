import express from "express";
import { getChapterStructureCodes } from "../controllers/configController.js";

const router = express.Router();

router.get("/chapter-structure-codes", getChapterStructureCodes);

export default router;
