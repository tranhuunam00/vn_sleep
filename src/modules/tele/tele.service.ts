import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { chatBotSleepWithLangChain } from 'src/common/util/langchain';

@Injectable()
export class TeleService {
  bot: any = null;
  constructor() {
    this.bot = new TelegramBot(process.env.TOKEN_BOT_TELE, { polling: true });
    this.bot.on('message', async (msg) => {
      if (!msg.text) return;

      console.log('msg', msg);
      const chatId = msg.chat.id;
      //
      const dataReturn = await chatBotSleepWithLangChain(msg.text);
      this.bot.sendMessage(chatId, dataReturn);
    });
  }
}
