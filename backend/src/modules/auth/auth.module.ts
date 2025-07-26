import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserEntity } from "@/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthTokenEntity } from "@/entities/auth-token.entity";
import { ConfigModule } from "@nestjs/config";
import { ArenaJwtModule } from "@/arena-jwt.module";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthTokenEntity]),
    ArenaJwtModule.register(),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}