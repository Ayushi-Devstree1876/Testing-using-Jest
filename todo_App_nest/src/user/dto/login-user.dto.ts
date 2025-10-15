// src/auth/dto/login-user.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'email must be an email' })
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;
}
