import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GmailService {
  constructor(private readonly mailerService: MailerService) {}
}
