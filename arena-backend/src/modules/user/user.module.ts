import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
