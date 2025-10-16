import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}