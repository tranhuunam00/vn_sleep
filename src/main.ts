import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ExcelJs } from './common/util/excel';
import * as fs from "fs"
import { langchainLibEmbedded } from './common/util/langchain';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await langchainLibEmbedded.indexesOwnData('src/data/Sleep.txt');
  const file = await fs.readFileSync("src/data/sleepques.xlsx")
  await ExcelJs.readExcelSleep(file,"Sheet1")
  await app.listen(process.env.PORT);
}
bootstrap();
