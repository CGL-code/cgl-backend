// Changed require → import
import express from "express";
import * as tagController from "../controllers/tagsController.js"; // use .js extension for ESM

const router = express.Router();

// API Routes
router.post("/create", tagController.createTag);
router.get("/list", tagController.getAllTags);
router.get("/list/:dataTypeCode", tagController.getTagsByDataType);
router.get("/:id", tagController.getTagById);
// Get tagMainIds for dataTypeCode
router.get("/tagMainIds/:dataTypeCode", tagController.getTagMainIdsByDataType);
// Get openingTag and closingTag for tagMainIds
router.get("/tagDetails/:tagMainId", tagController.getTagDetailsByTagMainId);
router.put("/update/:id", tagController.updateTag);
router.delete("/delete/:id", tagController.deleteTag);

// Changed module.exports → export default
export default router;
