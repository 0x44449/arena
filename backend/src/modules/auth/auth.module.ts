import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserEntity } from "@/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthTokenEntity } from "@/entities/auth-token.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AuthTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}