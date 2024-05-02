import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hashPw } from 'src/common/util/helper';
import { LoginDto } from '../dto/login.auth.dto';
import { comparePw } from '../../common/util/helper';
import { JwtService } from '@nestjs/jwt';
import { ConfirmAuthDto } from '../dto/confirm.auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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

    let user: User = null;

    if (userExist) {
      user = userExist;
      await this.userService.update(
        { ...data, password: hash, _id: userExist._id },
        { filter: { username: username } },
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
        username: user.username,
        role: user.role,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      },
    );
    try {
      await this.mailerService.sendMail({
        to: 'tranhuunam23022000@gmail.com',
        from: '"Welcome to the fold" <linux@over.windows>', // sender address
        subject: 'Quotes', // Subject line
        text: token, // plaintext body
        html: '',
      });
    } catch (error) {
      console.log('error', error);
    }

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
        expiresIn: '2h',
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

  async confirm(data: ConfirmAuthDto) {
    const { token } = data;
    const dataToken = this.jwtService.decode(token);

    console.log(dataToken);
  }
}
