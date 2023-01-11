import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmtpConfigService {
  constructor(private configService: ConfigService) {}

  get getSmtpCredentials() {
    return {
      emailFrom: this.configService.get('EMAIL_FROM'),
      password: this.configService.get('EMAIL_FROM_PASSWORD'),
    };
  }
}
