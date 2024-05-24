import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ExcelJs } from './common/util/excel';
import * as fs from 'fs';
import { langchainLibEmbedded } from './common/util/langchain';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}

const migrateData = async () => {
  const file = await fs.readFileSync('src/data/sleepques3.xlsx');
  await ExcelJs.readExcelSleep2(file, 'Sheet1');

  await langchainLibEmbedded.indexesOwnData('src/data/Sleep3.txt');
};

// migrateData();
bootstrap();
