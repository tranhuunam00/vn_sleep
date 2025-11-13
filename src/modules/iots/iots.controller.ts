import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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
async exportExcel(
  @Res() res: Response,
  @Query('limit') limit?: string,
  @Query('offset') offset?: string,
  @Query('userId') userId?: string,
) {
  const filePath = await this.iotService.exportIotData({
    limit: Number(limit) || 1000,
    offset: Number(offset) || 0,
    userId: userId || null,
  });

  res.download(filePath, 'iot-data.xlsx', () => {
    // fs.unlinkSync(filePath); // Nếu muốn xoá sau khi tải
  });
}
}
