import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata'; // 빌드시 자동 생성

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Arena API')
    .setDescription('Arena 백엔드 API 문서')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    }, 'access-token')
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // dev 구동을 위한 CORS 설정, 추후 삭제
  const allowedCors = process.env.CORS_ALLOWED_ORIGINS?.split(',') ?? [];
  if (allowedCors.length > 0) {
    app.enableCors({
      origin: allowedCors,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
