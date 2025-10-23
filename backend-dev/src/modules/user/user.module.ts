import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { FileEntity } from "@/entities/file.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}