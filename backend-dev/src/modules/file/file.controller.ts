import { Controller, Get, Post } from "@nestjs/common";

@Controller("api/v1/files")
export class FileController {
  @Get(":fileId")
  getFile(): string {
    return "File details";
  }

  @Post()
  uploadFile(): string {
    return "File uploaded";
  }

  @Post("multiple")
  uploadMultipleFiles(): string {
    return "Multiple files uploaded";
  }
}