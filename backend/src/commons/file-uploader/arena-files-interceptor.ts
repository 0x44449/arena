import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import ArenaFile from "./arena-file-util";

export function ArenaFilesInterceptor() {
  return FilesInterceptor('files', 10, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 최대 100MB 파일 크기
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const destinationDir = ArenaFile.getDestPath();
        cb(null, destinationDir); // 업로드 디렉토리 설정
      },
      filename: (req, file, cb) => {
        const fileName = ArenaFile.genFileName();
        cb(null, `${fileName}`);
      }
    })
  })
}