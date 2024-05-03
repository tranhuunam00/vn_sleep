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

      if (!contentQuestion) {
        numberNone = numberNone + 1;
      } else {
        numberNone = 0;
        // lưu vào dạng txt
        await fs.appendFileSync(
          'src/data/Sleep.txt',
          `${indexC.v}. ${contentQuestion.v.replaceAll('\r\n', ' ').replaceAll('\n', ' ')}\n`,
        );
      }
      if (numberNone > 5) {
        break;
      }
      index = index + 1;
    }
  }
}
