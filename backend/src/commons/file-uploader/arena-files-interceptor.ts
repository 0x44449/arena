import { FilesInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { join } from "path";

export function ArenaFilesInterceptor() {
  return FilesInterceptor('files', 10, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 최대 100MB 파일 크기
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const destinationDir = process.env.FILE_STORAGE_LOCATION || join(__dirname, '../../uploads');
        cb(null, destinationDir); // 업로드 디렉토리 설정
      },
      filename: (req, file, cb) => {
        const fileName = randomUUID();
        cb(null, `${fileName}`);
      }
    })
  })
}