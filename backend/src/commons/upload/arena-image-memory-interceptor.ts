import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export function ArenaImageMemoryInterceptor() {
  return FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('image only'), false);
      }
      cb(null, true);
    },
  });
}