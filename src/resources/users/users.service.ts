import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../core/database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser({ email, name, password }: CreateUserDto) {
    const user = await this.databaseService.user.create({
      data: { name, email, password },
    });

    return user;
  }

  async getUsers() {
    const users = await this.databaseService.user.findMany();

    return users;
  }

  async getUser({ id }: GetUserDto) {
    const user = await this.databaseService.user.findUnique({ where: { id } });

    return user;
  }

  async updateUser(
    { id }: GetUserDto,
    { email, name, password }: UpdateUserDto,
  ) {
    const user = await this.databaseService.user.update({
      where: { id },
      data: { email, name, password },
    });

    return user;
  }

  async deleteUser({ id }: GetUserDto) {
    await this.databaseService.user.delete({ where: { id } });
  }
}
