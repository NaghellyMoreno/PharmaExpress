import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173', credentials: true });
  const puerto = Number(process.env.PORT ?? 3000);
  await app.listen(puerto);
  // eslint-disable-next-line no-console
  console.log(`[api] escuchando en http://localhost:${puerto}`);
}

bootstrap();
