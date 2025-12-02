//  ESM import
import Tag from "../models/Tags.js";

//  Create a new tag
export const createTag = async (req, res) => {
  try {
    const { dataTypeCode, openingTag, closingTag, isDefault } = req.body;

    if (!dataTypeCode || !openingTag || !closingTag) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTag = new Tag({ dataTypeCode, openingTag, closingTag, isDefault });
    await newTag.save();

    res.status(201).json({ message: "Tag created successfully", tag: newTag });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Get all tags
export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Get tags by dataTypeCode
export const getTagsByDataType = async (req, res) => {
  try {
    const { dataTypeCode } = req.params;
    const tags = await Tag.find({ dataTypeCode });

    if (!tags.length) {
      return res.status(404).json({ message: "No tags found for this dataTypeCode" });
    }

    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Get tag by ID
export const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Get all tagMainId values for a given dataTypeCode
export const getTagMainIdsByDataType = async (req, res) => {
  try {
    const { dataTypeCode } = req.params;

    const tags = await Tag.find({ dataTypeCode }).select("tagMainId");

    if (!tags.length) {
      return res.status(404).json({ message: "No tags found for this dataTypeCode" });
    }

    const tagMainIds = tags.map(tag => tag.tagMainId);

    res.status(200).json(tagMainIds);
  } catch (error) {
    console.error("Error fetching tagMainIds:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Get opening and closing tag for a specific tagMainId
export const getTagDetailsByTagMainId = async (req, res) => {
  try {
    const { tagMainId } = req.params;

    const tag = await Tag.findOne({ tagMainId }).select("openingTag closingTag");

    if (!tag) {
      return res.status(404).json({ message: "Tag not found for this tagMainId" });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error("Error fetching tag details:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Update a tag
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { dataTypeCode, openingTag, closingTag, isDefault } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { dataTypeCode, openingTag, closingTag, isDefault },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag updated successfully", tag: updatedTag });
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Delete a tag
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
