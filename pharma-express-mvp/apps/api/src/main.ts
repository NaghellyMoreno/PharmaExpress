import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { COOKIE_NAVEGADOR } from './common/paciente.guard';
import { idAleatorio } from './common/cripto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  // Identificador opaco del navegador (cookie httpOnly). No prueba identidad: solo agrupa vinculaciones (DEC-10).
  app.use((req: any, res: any, next: () => void) => {
    if (!req.cookies?.[COOKIE_NAVEGADOR]) {
      const id = idAleatorio();
      req.cookies = { ...(req.cookies ?? {}), [COOKIE_NAVEGADOR]: id };
      res.cookie(COOKIE_NAVEGADOR, id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 400 * 24 * 3600 * 1000 });
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  if (process.env.WEB_ORIGIN) app.enableCors({ origin: process.env.WEB_ORIGIN, credentials: true });
  await app.listen(Number(process.env.PORT ?? 3000));
}
bootstrap();
