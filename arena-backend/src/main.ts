import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('arena example')
    .setDescription('The arena API description')
    .setVersion('1.0')
    .addTag('arena')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      // 1. "Controller" 라는 단어를 제거 (예: AuthController -> Auth)
      const controllerName = controllerKey.replace('Controller', '');

      // 2. 메서드 첫 글자를 대문자로 변환 (예: regist -> Regist)
      const capitalizedMethod = methodKey.charAt(0).toUpperCase() + methodKey.slice(1);

      // 3. 합치기 (예: Auth + Regist -> AuthRegist)
      return `${controllerName}${capitalizedMethod}`;
    },
  });
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: '/swagger-json',
  });

  await app.listen(process.env.PORT ?? 8002);
}
bootstrap();
