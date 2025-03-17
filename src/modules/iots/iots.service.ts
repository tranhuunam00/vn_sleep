import { Injectable } from '@nestjs/common';

import { CreateIotDto } from './dto/create-iot.dto';
import { IotRepo } from './iot.repo';
import mongoose from 'mongoose';
import * as ExcelJS from 'exceljs';

@Injectable()
export class IotService {
  constructor(private readonly iotRepo: IotRepo) {}
  async createIotData(data: CreateIotDto) {
    const dataCreate = data.data.map((d) => ({
      _id: new mongoose.Types.ObjectId(),
      value: d.value,
      createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
      user: d.user,
    }));

    await this.iotRepo.createAll(dataCreate);
  }

  async exportIotData() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 🟢 Thêm tiêu đề cột
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tên', key: 'user', width: 25 },
      { header: 'Giá trị', key: 'value', width: 30 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 },
    ];

    const datas = await this.iotRepo.find();

    datas.forEach((item) => {
      worksheet.addRow({
        id: item._id,
        user: item.user,
        value: item.value,
        createdAt: item.createdAt,
      });
    });
    const filePath = `iot.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
}
