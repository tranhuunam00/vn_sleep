import { Global, Module } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // host: 'smtp.example.com',
        service: 'gmail',
        secure: false,
        // port: 587,
        auth: {
          type: 'OAuth2',
          user: process.env.ADMIN_EMAIL_ADDRESS,
          clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
          clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [GmailService],
  exports: [GmailService],
})
export class GmailModule {}
