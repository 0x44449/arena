import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { GlobalExceptionFilter } from './common/exception-manage/global-exception-filter';
import express from 'express';
import { join } from 'path';
import metadata from './metadata';

dayjs.extend(utc);
dayjs.extend(timezone);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global error 핸들링
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Static 파일 제공
  app.use('/public', express.static(join(process.cwd(), 'public')));

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

  // DTO 생성을 위한 class-transformer 설정
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     transformOptions: {
  //       excludeExtraneousValues: true,
  //       enableImplicitConversion: true,
  //     },
  //   })
  // );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Arena Nest 서버가 ${port}번 포트에서 실행 중입니다`);
}
bootstrap();
