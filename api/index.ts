// api/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.init();
}

let isBootstrapped = false;

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!isBootstrapped) {
    await bootstrap();
    isBootstrapped = true;
  }
  server(req, res);
};