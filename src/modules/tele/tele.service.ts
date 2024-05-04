import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { langchainLibEmbedded } from 'src/common/util/langchain';
import { chatWithOpenAI, getSLeepFromAI } from 'src/common/util/openAi';
import sleepQaApp from 'src/common/util/sleepQA';

@Injectable()
export class TeleService {
  bot: any = null;
  constructor() {
    this.bot = new TelegramBot(process.env.TOKEN_BOT_TELE, { polling: true });
    this.bot.on('message', async (msg) => {
      if (!msg.text) return 
      
      console.log('msg', msg);
      const chatId = msg.chat.id;
      //
      const data = await langchainLibEmbedded.initQuestionWithScore(msg.text);

      const score = data[0][1];
      const score2 = data[1][1];

      console.log(data);
      let dataReturn: string = '';
      if (+score < 0.2 && +score < +score2 - 0.05) {
        dataReturn = data[0][0]['pageContent'];
      }

      if (+score < 0.1) {
        dataReturn = sleepQaApp.qa[data[0][0]['pageContent']];
      }

      const stringData = data.reduce((prev, curr, index) => {
        prev =
          prev +
          `\n Câu ${index}: ${curr[0]['pageContent']} có trọng số là ${curr[1]}`;
        return prev;
      }, '');
      if (!dataReturn && +score < 0.3) {
        dataReturn = await getSLeepFromAI(stringData, msg.text);
      }
      if (!dataReturn && +score >= 0.3) {
        dataReturn = await chatWithOpenAI(msg.text);
      }
      this.bot.sendMessage(chatId, dataReturn);
    });
  }
}
