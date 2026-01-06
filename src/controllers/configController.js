
import masterStructureCodes from "../config/loadMasterStructureCodes.js";

export const getChapterStructureCodes = (req, res) => {
  res.json(masterStructureCodes);
};






{/*import MasterStructureCodes from "../config/loadMasterStructureCodes.js";

export const getMasterStructureCodes = (req, res) => {
  res.status(200).json(MasterStructureCodes);
};*/}
