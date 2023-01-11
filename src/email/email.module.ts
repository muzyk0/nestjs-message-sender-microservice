import { join } from 'path';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailTemplateManager } from './application/email-template-manager';
import { EmailService } from './application/email.service';
import { EmailController } from './api/email.controller';
import { SendConfirmationCodeHandler } from './application/use-cases/send-confirmation-code.handler';
import { SendRecoveryPasswordTempCodeHandler } from './application/use-cases/send-recovery-password-temp-code.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { SendTestEmailHandler } from './application/use-cases/send-test-email.handler';
import { SmtpConfigService } from '../config/smtp.service';

const CommandHandlers = [
  SendConfirmationCodeHandler,
  SendRecoveryPasswordTempCodeHandler,
  SendTestEmailHandler,
];

@Global()
@Module({
  imports: [
    CqrsModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          // or transport: config.get("MAIL_TRANSPORT"),
          transport: {
            service: 'Gmail',
            auth: {
              user: config.get<string>('EMAIL_FROM'),
              pass: config.get<string>('EMAIL_FROM_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${config.get<string>('EMAIL_FROM')}>`,
          },
          // preview: true,
          template: {
            dir: join(__dirname, 'templates'), // or process.cwd() + '/template/'
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    EmailController,
    EmailService,
    EmailTemplateManager,
    { provide: 'BASE_URL', useValue: 'https://9art.ru' },
    SmtpConfigService,
    ...CommandHandlers,
  ],
  exports: [
    EmailController,
    EmailService,
    EmailTemplateManager,
    { provide: 'BASE_URL', useValue: 'https://9art.ru' },
    ...CommandHandlers,
  ],
})
export class EmailModule {}
