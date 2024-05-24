import * as fs from 'fs';
import { ExcelJs } from './excel';

class SleepQa {
  qa: { [key: string]: string } = {};

  constructor() {
    this.load();
  }
  async load() {
    const file = await fs.readFileSync('src/data/sleepques3.xlsx');
    this.qa = await ExcelJs.jsonExcelSleep(file, 'Sheet1');
  }
}
const sleepQaApp = new SleepQa();
export default sleepQaApp;
