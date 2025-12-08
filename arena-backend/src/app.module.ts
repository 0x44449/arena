import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';
import { ArenaAuthModule } from './auth/arena-auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ArenaAuthModule
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AppModule {}
