/* eslint-disable */
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BaseQueryPayload,
  BaseRepository,
} from 'src/common/database/base-repository.mongo';
import { Iot } from './schemas/iot.schema';

@Injectable()
export class IotRepo implements BaseRepository<Iot> {
  constructor(@InjectModel(Iot.name) private IotModelMongo: Model<Iot>) {}
  async update(entity: Partial<Iot>, payload?: BaseQueryPayload): Promise<Iot> {
    return await this.IotModelMongo.findOneAndUpdate(payload.filter, entity);
  }
  findById(id: string | number): Promise<Iot> {
    return this.IotModelMongo.findById(id).exec();
  }
  async findOne(payload?: BaseQueryPayload): Promise<Iot> {
    return await this.IotModelMongo.findOne(payload).exec();
  }
  delete(entity: Iot): Promise<Iot> {
    throw new Error('Method not implemented.');
  }
  getNewId(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  create(): Promise<Iot> {
    throw new Error('Method not implemented.');
  }

  async createAll(createIotDto: Iot[]): Promise<boolean> {
    await this.IotModelMongo.insertMany(createIotDto);
    return true;
  }

  async find(filter = {}, options: { limit?: number; skip?: number } = {}) {
     const query = this.IotModelMongo.find(filter);
     if (options.limit !== undefined) query.limit(options.limit);
    if (options.skip !== undefined) query.skip(options.skip);
    
      return await query.exec();
  }
}
