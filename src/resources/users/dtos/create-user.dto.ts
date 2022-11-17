import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Email of the user' })
  @IsEmail({ message: 'The email of the user must be a valid email address' })
  readonly email: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsAlpha('en-US', { message: 'The name of the user must be an alpha string' })
  readonly name: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString({ message: 'The password of the user must be a string' })
  @MinLength(6, {
    message: 'The password of the user must have, at least, 6 characters',
  })
  readonly password: string;
}
