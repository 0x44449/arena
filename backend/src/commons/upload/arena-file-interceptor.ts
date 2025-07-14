import { FileInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { join } from "path";

export function ArenaFileInterceptor() {
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = process.env.FILE_STORAGE_LOCATION || join(__dirname, '../../uploads');
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const fileName = randomUUID();
        callback(null, `${fileName}`);
      },
    })
  });
}