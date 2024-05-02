import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessTokenGoogle } from './google';

export class NodeMailerLib {
  public static async send(
    data: {
      to: string;
      subject: string;
      text: string;
      from: string;
    },
    callback: (error, response) => void,
  ): Promise<void> {
    const accessToken = await getAccessTokenGoogle();
    console.log('accessToken', accessToken);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      to: data.to,
      subject: data.subject,
      html: `<a>${process.env.BE_DOMAIN}/auth/confirm?token=${data.text}</a>`,
    };
    await transporter.sendMail(mailOptions, callback);
  }
}
