import { read } from 'xlsx';
import * as fs from 'fs';

export class ExcelJs {
  static async readExcel(data: any) {
    const wb = read(data);
    return wb;
  }
  static async readExcelSleep(data: any, sheetName: string) {
    const wb = read(data);
    const sheet = wb.Sheets[sheetName];
    let index = 3;
    let numberNone = 0;
    while (true) {
      const indexC = sheet[`A${index}`];
      const contentQuestion = sheet[`D${index}`];
      const contentAnswer = sheet[`E${index}`];

      if (!contentQuestion || !contentAnswer) {
        numberNone = numberNone + 1;
      } else {
        numberNone = 0;
        const stringQ = `${indexC.v}. ${contentQuestion.v.replaceAll('\r\n', ' ').replaceAll('\n', ' ')}\n`;
        // lưu vào dạng txt
        await fs.appendFileSync('src/data/Sleep.txt', stringQ);
      }
      if (numberNone > 10) {
        break;
      }
      index = index + 1;
    }
  }

  static async readExcelSleep2(data: any, sheetName: string) {
    const wb = read(data);
    const sheet = wb.Sheets[sheetName];
    let index = 5;
    let numberNone = 0;
    let answer = '';
    let stt = 0;
    while (true) {
      const contentQuestion = sheet[`D${index}`];
      const contentAnswer = sheet[`E${index}`];
      const sttContent = sheet[`C${index}`];

      if (answer != contentAnswer && contentAnswer) {
        answer = contentAnswer.v;
      }
      if (stt != sttContent && sttContent) {
        stt = stt + 1;
      }
      if (!contentQuestion || !answer) {
        numberNone = numberNone + 1;
      } else {
        numberNone = 0;
        const stringQ = `${stt}. ${contentQuestion.v.replaceAll('\r\n', ' ').replaceAll('\n', ' ')}\n`;
        // lưu vào dạng txt
        await fs.appendFileSync('src/data/Sleep2.txt', stringQ);
      }
      if (numberNone > 10) {
        break;
      }
      index = index + 1;
    }
  }
  static async jsonExcelSleep(data: any, sheetName: string) {
    const wb = read(data);
    const sheet = wb.Sheets[sheetName];
    let index = 5;
    let numberNone = 0;
    const jsonObj = {};
    let answer = '';
    let stt = 0;
    while (true) {
      const contentQuestion = sheet[`D${index}`];
      const contentAnswer = sheet[`E${index}`];
      const sttContent = sheet[`C${index}`];

      if (answer != contentAnswer && contentAnswer) {
        answer = contentAnswer.v;
      }
      if (stt != sttContent && sttContent) {
        stt = stt + 1;
      }
      if (!contentQuestion || !answer) {
        numberNone = numberNone + 1;
      } else {
        numberNone = 0;
        const stringQ = `${stt}. ${contentQuestion.v.replaceAll('\r\n', ' ').replaceAll('\n', ' ')}`;
        const stringA = `${answer}`;

        // lưu vào dạng txt
        jsonObj[stringQ] = stringA;
      }
      if (numberNone > 10) {
        break;
      }
      index = index + 1;
    }
    return jsonObj;
    // fs.appendFileSync('src/data/sleepQA.json', JSON.stringify(jsonObj));
  }
}
