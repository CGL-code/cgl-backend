import express from "express";
import { getMasterStructureCodes } from "../controllers/configController.js";

const router = express.Router();

router.get("/master-structure-codes", getMasterStructureCodes);

export default router;
