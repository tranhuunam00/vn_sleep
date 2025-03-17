import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { IotService } from './iots.service';
import { CreateIotDto } from './dto/create-iot.dto';
import { Response } from 'express';

@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post('/')
  async createIotData(@Body() data: CreateIotDto) {
    return await this.iotService.createIotData(data);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const filePath = await this.iotService.exportIotData();

    res.download(filePath, 'users-data.xlsx', () => {
      // fs.unlinkSync(filePath); // Xóa file sau khi tải
    });
  }
}
