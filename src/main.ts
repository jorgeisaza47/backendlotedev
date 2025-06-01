// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { DateFormatInterceptor } from './interceptors/date-format.interceptor';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api');
//   app.useGlobalInterceptors(new DateFormatInterceptor());

//   // Habilitar CORS
//   app.enableCors({
//     origin: 'http://localhost:4200', // Permite solicitudes desde este origen
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
//     credentials: true, // Permite el envío de credenciales (cookies, headers de autenticación)
//   });

//   await app.listen(3000);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     }),
//   );
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:4200', // Permite solicitudes desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permite el envío de credenciales (cookies, headers de autenticación)
  });

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
