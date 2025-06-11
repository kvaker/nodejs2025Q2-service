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
    const user = this.userService.getByLoginWithPassword(dto.login);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = { id: user.id, login: user.login };

    const secretKey = process.env.JWT_SECRET_KEY;
    const refreshSecretKey = process.env.JWT_SECRET_REFRESH_KEY;
    const expireTime = parseInt(process.env.TOKEN_EXPIRE_TIME || '3600', 10);
    const refreshExpireTime = parseInt(
      process.env.TOKEN_REFRESH_EXPIRE_TIME || '604800',
      10,
    );

    if (!secretKey || !refreshSecretKey || !expireTime || !refreshExpireTime) {
      throw new Error('Missing JWT configuration');
    }

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: expireTime,
    });

    const refreshToken = jwt.sign(payload, refreshSecretKey, {
      expiresIn: refreshExpireTime,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_REFRESH_KEY as string,
      ) as jwt.JwtPayload;

      const accessExpire = process.env
        .TOKEN_EXPIRE_TIME as jwt.SignOptions['expiresIn'];
      const refreshExpire = process.env
        .TOKEN_REFRESH_EXPIRE_TIME as jwt.SignOptions['expiresIn'];

      const newAccessToken = jwt.sign(
        { id: payload.id, login: payload.login },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: accessExpire },
      );

      const newRefreshToken = jwt.sign(
        { id: payload.id, login: payload.login },
        process.env.JWT_SECRET_REFRESH_KEY as string,
        { expiresIn: refreshExpire },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
