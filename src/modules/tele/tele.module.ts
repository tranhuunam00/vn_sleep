import { Module } from '@nestjs/common';
import { TeleService } from './tele.service';

@Module({
  providers: [TeleService],
})
export class TeleModule {}
