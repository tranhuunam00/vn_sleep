import { Module } from '@nestjs/common';
import { IotController } from './iots.controller';
import { IotService } from './iots.service';
import { IotRepo } from './iot.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Iot, IotSchema } from './schemas/iot.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Iot.name, schema: IotSchema }])],
  controllers: [IotController],
  providers: [IotService, IotRepo],
})
export class IotModule {}
