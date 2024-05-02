import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hashPw } from 'src/common/util/helper';
import { LoginDto } from '../dto/login.auth.dto';
import { comparePw } from '../../common/util/helper';
import { JwtService } from '@nestjs/jwt';
import { ConfirmAuthDto } from '../dto/confirm.auth.dto';
import { User } from '../user/schemas/user.schema';
import { NodeMailerLib } from 'src/common/util/nodemailer.lib';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    const { email, password } = data;
    // 1. check có tồn tại tài khoản chưa
    const userExist = await this.userService.findOneByCondition({
      filter: {
        email,
      },
    });
    console.log(userExist);
    if (userExist?.isVerify) {
      throw new BadRequestException('Tài khoản đã tồn tại');
    }
    // 2. hashpw
    const hash = await hashPw(password);
    // 3. lưu vào db

    let user: User = null;

    if (userExist) {
      user = userExist;
      await this.userService.update(
        { ...data, password: hash, _id: userExist._id },
        { filter: { email: email } },
      );
    } else {
      user = await this.userService.create({
        ...data,
        password: hash,
      });
    }
    // 4. gửi mail
    const token = await this.jwtService.sign(
      {
        email: user.email,
        role: user.role,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      },
    );
    try {
      await NodeMailerLib.send(
        {
          to: email,
          from: 'Xin chào đã đến với VN Sleep', // sender address
          subject: 'Chấp nhận đăng kí VN SLeep', // Subject line
          text: token, // plaintext body
          // html: 'êr',
        },
        async (error, response) => {
          console.log(error);
          console.log(response);
        },
      );
    } catch (error) {
      console.log('error', error);
    }

    return 'Thành công';
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const userExist = await this.userService.findOneByCondition({
      filter: {
        email,
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
        email: userExist.email,
        role: userExist.role,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '2h',
      },
    );

    return {
      token,
      user: {
        _id: userExist._id,
        email: userExist.email,
      },
    };
  }

  async confirm(data: ConfirmAuthDto) {
    const { token } = data;
    const dataToken = this.jwtService.decode(token);

    console.log(dataToken);
  }
}
