import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsUUID('4', { message: 'The ID of ther user must be a uuid' })
  readonly id: string;
}
