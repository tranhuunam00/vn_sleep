import { Injectable } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { BaseQueryPayload } from 'src/common/database/base-repository.mongo';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async findAll() {
    console.log('[UserService] findALl');
    return await this.userRepo.find();
  }

  async findOneByCondition(condition: BaseQueryPayload) {
    return await this.userRepo.findOne(condition?.filter);
    // return this.userRepo.
  }

  async create(data: CreateUserDto) {
    return await this.userRepo.create(data);
  }

  async update(data: Partial<User>, condition: BaseQueryPayload) {
    return await this.userRepo.update(data, condition);
  }
}
