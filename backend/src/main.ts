import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WellKnownExceptionFilter } from './commons/well-known-exception-filter';
import { UnauthorizedExceptionFilter } from './commons/unauthorized-exception-filter';
import { ConfigModule } from '@nestjs/config';
import firebaseAdmin from './libs/firebase.plugin';
import metadata from './metadata'; // 빌드시 자동 생성

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // env 환경변수 로드 대기
  await ConfigModule.envVariablesLoaded;

  // Firebase Admin SDK 초기화
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

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

  // ExceptionFilter 설치
  app.useGlobalFilters(new WellKnownExceptionFilter(), new UnauthorizedExceptionFilter());

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
