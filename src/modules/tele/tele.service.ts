import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { langchainLibEmbedded } from 'src/common/util/langchain';

@Injectable()
export class TeleService {
  bot: any = null;
  constructor() {
    this.bot = new TelegramBot(process.env.TOKEN_BOT_TELE, { polling: true });
    this.bot.on('message', async (msg) => {
      console.log('msg', msg);
      const chatId = msg.chat.id;
      const messageId = msg.messageId;
      //
      const data = await langchainLibEmbedded.initQuestionWithScore(msg.text);
      console.log(data);
      this.bot.sendMessage(chatId, '1');
    });
  }
}
