import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import "reflect-metadata";
import { WellKnownExceptionFilter } from './exceptions/well-known-exception-filter';
import { UnauthorizedExceptionFilter } from './exceptions/unauthorized-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ARENA')
    .setDescription('The ARENA API description')
    .setVersion('1.0')
    .addTag('ARENA')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  // ExceptionFilter 설치
  app.useGlobalFilters(new WellKnownExceptionFilter(), new UnauthorizedExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
