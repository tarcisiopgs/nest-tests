import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsUUID('4')
  readonly id: string;
}
