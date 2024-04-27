import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hashPw } from 'src/common/util/helper';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(data: CreateUserDto) {
    const { username, password } = data;
    // 1. check có tồn tại tài khoản chưa
    const userExist = await this.userService.findOneByCondition({
      filter: {
        username,
      },
    });
    console.log(userExist);
    if (userExist?.isVerify) {
      throw new BadRequestException('Tài khoản đã tồn tại');
    }
    // 2. hashpw
    const hash = await hashPw(password);
    // 3. lưu vào db
    if (userExist) {
      await this.userService.update(
        { ...data },
        { filter: { username: username } },
      );
    } else {
      await this.userService.create({
        ...data,
        password: hash,
      });
    }
    // 4. gửi mail
    return 'Thành công';
  }
}
