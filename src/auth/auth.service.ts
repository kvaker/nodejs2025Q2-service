import { Injectable, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(dto: SignupDto) {
    const existingUser = this.userService
      .getAll()
      .find((user) => user.login === dto.login);
    if (existingUser) {
      throw new ForbiddenException('User with this login already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ ...dto, password: hash });

    return user;
  }

  async login(dto: LoginDto) {
    const user = this.userService
      .getAll()
      .find((user) => user.login === dto.login);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = { id: user.id, login: user.login };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH_KEY, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_REFRESH_KEY,
      );
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });
      const newRefreshToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_REFRESH_KEY,
        {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      );
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
