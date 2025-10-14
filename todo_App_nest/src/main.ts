/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:false}))
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(` Your server is running on http://localhost:${PORT}`);
}
bootstrap();
                                                                                                                                                                                                            