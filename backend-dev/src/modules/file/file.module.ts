import { FileEntity } from "@/entities/file.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), AuthModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}