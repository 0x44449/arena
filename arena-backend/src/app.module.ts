import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';
import { ArenaAuthModule } from './auth/arena-auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const port = configService.get<string>('DB_PORT');
        return buildDataSourceOptions({
          host: configService.get<string>('DB_HOST'),
          port: port ? Number(port) : undefined,
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        });
      },
    }),
    ArenaAuthModule
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AppModule {}
