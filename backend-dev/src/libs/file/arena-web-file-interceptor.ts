import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import { diskStorage, memoryStorage } from "multer";
import { join } from "path";

function getUploadServerPath() {
  return process.env.FILE_STORAGE_LOCATION || join(__dirname, "../../uploads");
}

const FILE_MAX_SIZE = 100 * 1024 * 1024; // 100MB

export const ArenaWebFileInterceptor = {
  singleStorage: (field: string = "file") => FileInterceptor(field, {
    limits: {
      fileSize: FILE_MAX_SIZE,
    },
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = getUploadServerPath();
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const fileName = randomUUID();
        callback(null, `${fileName}`);
      },
    })
  }),

  multipleStorage: (field: string = "files") => FilesInterceptor(field, 10, {
    limits: {
      fileSize: FILE_MAX_SIZE,
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const destinationDir = getUploadServerPath();
        cb(null, destinationDir); // 업로드 디렉토리 설정
      },
      filename: (req, file, cb) => {
        const fileName = randomUUID();
        cb(null, `${fileName}`);
      }
    })
  }),

  singleMemory: (field: string = "file") => FileInterceptor(field, {
    storage: memoryStorage(),
    limits: {
      fileSize: FILE_MAX_SIZE
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('image only'), false);
      }
      cb(null, true);
    },
  }),
}
