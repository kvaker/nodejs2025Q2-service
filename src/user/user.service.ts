import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAll(): Omit<User, 'password'>[] {
    return this.users.map((user) => {
      const clone = { ...user };
      delete clone.password;
      return clone;
    });
  }

  getById(id: string): Omit<User, 'password'> {
    const user = this.findUser(id);
    const clone = { ...user };
    delete clone.password;
    return clone;
  }

  getByLoginWithPassword(login: string): User | undefined {
    return this.users.find((u) => u.login === login);
  }

  create(dto: CreateUserDto): Omit<User, 'password'> {
    if (!dto.login || !dto.password)
      throw new BadRequestException('Missing fields');

    const now = Date.now();
    const newUser: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);

    const clone = { ...newUser };
    delete clone.password;
    return clone;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): Omit<User, 'password'> {
    const user = this.findUser(id);

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Wrong password');
    }

    user.password = dto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    const clone = { ...user };
    delete clone.password;
    return clone;
  }

  delete(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }

  private findUser(id: string): User {
    if (!this.isUUID(id)) throw new BadRequestException('Invalid UUID');

    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private isUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    );
  }
}
