import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.NESTJS_PORT ?? 5000;
  await app.listen(port, () => {
    console.log(`${port}에서 실행중`);
  });
}
bootstrap();
