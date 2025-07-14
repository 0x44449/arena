import { FileEntity } from "@/entities/file.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { UserEntity } from "@/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    FileEntity,
    UserEntity,
  ])],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [TypeOrmModule],
})
export class FilesModule {}