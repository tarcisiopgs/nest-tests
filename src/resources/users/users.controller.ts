import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'User not created' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() { email, name, password }: CreateUserDto) {
    try {
      const data = await this.usersService.create({ email, name, password });

      return { message: 'User created successfully', data };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({ description: 'Users getted' })
  @ApiBadRequestResponse({ description: 'Users not getted' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findMany() {
    try {
      const data = await this.usersService.findMany();

      return { message: 'Users getted successfully', data };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ description: 'User getted ' })
  @ApiBadRequestResponse({ description: 'User not getted' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findUnique(@Param() { id }: GetUserDto) {
    try {
      const data = await this.usersService.findUnique({ id });

      return { message: 'User getted successfully', data };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User updated ' })
  @ApiBadRequestResponse({ description: 'User not updated' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(
    @Param() { id }: GetUserDto,
    @Body() { email, name, password }: UpdateUserDto,
  ) {
    try {
      const data = await this.usersService.update(
        { id },
        { email, name, password },
      );

      return { message: 'User updated successfully', data };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'User deleted ' })
  @ApiBadRequestResponse({ description: 'User not deleted' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(@Param() { id }: GetUserDto) {
    try {
      await this.usersService.delete({ id });

      return { message: 'User deleted successfully' };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
