import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { EmailModule } from './email/email.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // NODE_ENV: Joi.string()
        //   .valid('development', 'production', 'test', 'provision')
        //   .default('development'),
        PORT: Joi.number().default(3000),
        SMTP: Joi.object({
          EMAIL_FROM: Joi.string(),
          EMAIL_FROM_PASSWORD: Joi.string(),
        }),
        RMQ_URLS: Joi.string(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
