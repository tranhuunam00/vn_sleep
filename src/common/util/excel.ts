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
  static async jsonExcelSleep(data: any, sheetName: string) {
    const wb = read(data);
    const sheet = wb.Sheets[sheetName];
    let index = 3;
    let numberNone = 0;
    const jsonObj = {};
    while (true) {
      const indexC = sheet[`A${index}`];
      const contentQuestion = sheet[`D${index}`];
      const contentAnswer = sheet[`E${index}`];
      if (!contentQuestion || !contentAnswer) {
        numberNone = numberNone + 1;
      } else {
        numberNone = 0;
        const stringQ = `${indexC.v}. ${contentQuestion.v.replaceAll('\r\n', ' ').replaceAll('\n', ' ')}`;
        const stringA = `${contentAnswer.v}`;

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
