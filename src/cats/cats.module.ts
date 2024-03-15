import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { MockCatsService } from './mock/cat.mock.provider';
@Module({
  imports: [CatsModule],
  controllers: [CatsController],
  providers: [
    {
      provide: CatsService,
      useClass: MockCatsService,
    },
  ],
})
export class CatsModule {}
