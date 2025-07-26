import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({})
export class ArenaJwtModule {
  static register(): DynamicModule {
    const jwt = JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN'),
          algorithm: 'HS256',
        },
      }),
    });
    return {
      module: ArenaJwtModule,
      imports: [jwt],
      exports: [jwt],
    };
  }
}