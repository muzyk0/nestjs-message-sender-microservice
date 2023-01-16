import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import {
  ISendRecoveryPasswordTempCodeCommand,
  SendRecoveryPasswordTempCodeCommand,
} from './email/application/use-cases/send-recovery-password-temp-code.handler';
import {
  ISendConfirmationCodeCommand,
  SendConfirmationCodeCommand,
} from './email/application/use-cases/send-confirmation-code.handler';
import {
  ISendTestEmailCommand,
  SendTestEmailCommand,
} from './email/application/use-cases/send-test-email.handler';
import { EventPatterns } from './email/application/interfaces/enums';

@Controller()
export class AppController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'health-check' })
  async healthCheck() {
    return 'Message service works correctly!';
  }

  @EventPattern(EventPatterns.SEND_TEST_EMAIL)
  async sendTestEmail({ email, userName }: ISendTestEmailCommand) {
    return this.commandBus.execute(new SendTestEmailCommand(email, userName));
  }

  @EventPattern(EventPatterns.SEND_CONFIRMATION_CODE)
  async SendConfirmationCode({
    email,
    userName,
    confirmationCode,
  }: ISendConfirmationCodeCommand): Promise<void> {
    return this.commandBus.execute(
      new SendConfirmationCodeCommand(email, userName, confirmationCode),
    );
  }

  @EventPattern(EventPatterns.SEND_RECOVERY_PASSWORD_TEMP_CODE)
  async SendRecoveryPasswordTempCode({
    email,
    userName,
    recoveryCode,
  }: ISendRecoveryPasswordTempCodeCommand): Promise<void> {
    return this.commandBus.execute(
      new SendRecoveryPasswordTempCodeCommand(email, userName, recoveryCode),
    );
  }
}
