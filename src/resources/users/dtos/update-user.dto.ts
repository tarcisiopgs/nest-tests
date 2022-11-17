import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly password?: string;
}
