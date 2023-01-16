import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('MESSAGE_SENDER_HOST'),
      port: Number(configService.get<string>('PORT')),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));

  console.log(`Application is running on: ${await app.getUrl()}`);
})();
