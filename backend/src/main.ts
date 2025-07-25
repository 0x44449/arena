import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';
import firebaseAdmin from './commons/firebase.plugin';
import metadata from './metadata'; // 빌드시 자동 생성
import { WellKnownExceptionFilter } from './commons/exceptions/well-known-exception-filter';
import { UnauthorizedExceptionFilter } from './commons/exceptions/unauthorized-exception-filter';
import cookieParser from 'cookie-parser';

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

  // CORS 설정
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

  // 쿠키 파서 사용 - 세션 쿠키 인증
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
