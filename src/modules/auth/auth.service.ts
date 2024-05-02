import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hashPw } from 'src/common/util/helper';
import { LoginDto } from '../dto/login.auth.dto';
import { comparePw } from '../../common/util/helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
        { ...data, password: hash },
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

  async login(data: LoginDto) {
    const { username, password } = data;
    const userExist = await this.userService.findOneByCondition({
      filter: {
        username,
        isVerify: true,
      },
    });
    console.log(userExist);
    if (!userExist) {
      throw new BadRequestException('Không tồn tại');
    }
    const hash = await userExist.password;
    const isEqual = await comparePw(password, hash);

    if (!isEqual) {
      throw new BadRequestException('Mật khẩu không đúng');
    }
    const token = await this.jwtService.sign(
      {
        _id: userExist._id,
        username: userExist.username,
        role: userExist.role,
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );

    return {
      token,
      user: {
        _id: userExist._id,
        username: userExist.username,
      },
    };
  }
}
