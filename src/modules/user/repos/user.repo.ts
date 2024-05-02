/* eslint-disable */
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  BaseQueryPayload,
  BaseRepository,
} from 'src/common/database/base-repository.mongo';

@Injectable()
export class UserRepo implements BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModelMongo: Model<User>) {}
  async update(
    entity: Partial<User>,
    payload?: BaseQueryPayload,
  ): Promise<User> {
    return await this.userModelMongo.findOneAndUpdate(payload.filter, entity);
  }
  findById(id: string | number): Promise<User> {
    return this.userModelMongo.findById(id).exec();
  }
  async findOne(payload?: BaseQueryPayload): Promise<User> {
    return await this.userModelMongo.findOne(payload).exec();
  }
  delete(entity: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  getNewId(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModelMongo({
      _id: new mongoose.Types.ObjectId(),
      ...createUserDto,
    });
    return await user.save();
  }

  async find(payload?: BaseQueryPayload): Promise<User[]> {
    return await this.userModelMongo.find(payload).exec();
  }
}
