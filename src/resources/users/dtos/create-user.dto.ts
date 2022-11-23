import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsAlpha('en-US')
  readonly name: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
