import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
dotenv.config();

const myOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_MAILER_CLIENT_ID,
  process.env.GOOGLE_MAILER_CLIENT_SECRET,
);

myOAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

export const getAccessTokenGoogle = async () => {
  const myAccessTokenObject = await myOAuth2Client.getAccessToken();
  return myAccessTokenObject?.token;
};
