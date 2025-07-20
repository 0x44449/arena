import { randomUUID } from "crypto";
import { join } from "path";

function genFileName() {
  return randomUUID();
}

function getDestPath() {
  return process.env.FILE_STORAGE_LOCATION || join(__dirname, '../../uploads');
}

const ArenaFile = {
  genFileName,
  getDestPath,
}
export default ArenaFile;