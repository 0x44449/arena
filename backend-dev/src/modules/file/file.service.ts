import { FileEntity } from "@/entities/file.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
  ) {}
}