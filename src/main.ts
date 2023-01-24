import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

(async function bootstrap() {
  const PORT = new ConfigService().get('PORT');
  const HOST = new ConfigService().get('TCP_HOST');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: HOST,
      port: PORT,
    },
  });

  Logger.log(`Microservice is listening at ${PORT}`);

  await app.listen();
})();
