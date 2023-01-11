import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { EmailService } from '../application/email.service';

@Controller('email-sender')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: 'health-check' })
  async sendTestEmail(email: string): Promise<void> {
    console.log('health-check', email);
    return this.emailService.sendEmail(
      email,
      'health check message sender',
      `<h3>OK<h3/>`,
    );
  }

  // @MessagePattern({ cmd: 'greeting-async' })
  // async getGreetingMessageAysnc(name: string): Promise<string> {
  //   return `Hello ${name} Async`;
  // }

  @EventPattern('send-email')
  async handleBookCreatedEvent(data: Record<string, unknown>) {
    console.log(data);
  }
}
