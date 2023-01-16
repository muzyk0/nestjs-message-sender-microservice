import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const rabbitMQUri = configService.get<string>('RMQ_URLS').split(', ');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'message-sender',
        brokers: ['glider.srvs.cloudkafka.com:9094'],
        ssl: true,
        sasl: {
          mechanism: 'scram-sha-512',
          username: 'pfznmagr',
          password: 'BYYCEcdfuNgH3HADbLLypoCnmo2GW4m_',
        },
      },
      consumer: {
        groupId: 'nofitications', // declaring consumer here
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
})();
