import fs from "fs";
import path from "path";

const filePath = path.resolve("src/config/MasterStructureCodes.json");

const MasterStructureCodes = JSON.parse(
  fs.readFileSync(filePath, "utf-8")
);

export default MasterStructureCodes;
