import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../core/database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create({ email, name, password }: CreateUserDto) {
    const user = await this.databaseService.user.create({
      data: { name, email, password },
    });

    return user;
  }

  async findMany() {
    const users = await this.databaseService.user.findMany();

    return users;
  }

  async findUnique({ id }: GetUserDto) {
    const user = await this.databaseService.user.findUnique({ where: { id } });

    return user;
  }

  async update({ id }: GetUserDto, { email, name, password }: UpdateUserDto) {
    const user = await this.databaseService.user.update({
      where: { id },
      data: { email, name, password },
    });

    return user;
  }

  async delete({ id }: GetUserDto) {
    await this.databaseService.user.delete({ where: { id } });
  }
}
