import express from "express";
import { getDsCodeOptions } from "../controllers/dscode.controller.js";

const router = express.Router();

router.get("/options", getDsCodeOptions);

export default router;
