import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import ArenaFile from "./arena-file-util";

export function ArenaFileInterceptor() {
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = ArenaFile.getDestPath();
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const fileName = ArenaFile.genFileName();
        callback(null, `${fileName}`);
      },
    })
  });
}