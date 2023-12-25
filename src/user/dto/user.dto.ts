import { IsEmail, IsString, MinLength } from "class-validator";

class RegisterUserDto {
  @IsString()
  @MinLength(6, { message: "fullName must have at least 6 characters." })
  fullName: string;

  @IsEmail({}, { message: "email must be an valid e-mail." })
  email: string;

  @IsString({ message: "password must be an string type." })
  @MinLength(6, { message: "password must have at least 6 characters." })
  password: string;
}

class AuthUserDto {
  @IsEmail({}, { message: "email must be an valid e-mail." })
  email: string;

  @IsString({ message: "password must be an string type." })
  @MinLength(6, { message: "password must have at least 6 characters." })
  password: string;
}

class ForgotUserPasswordDto {
  @IsEmail({}, { message: "email must be an valid e-mail." })
  email: string;

  @IsString({ message: "newPassword must be an string type." })
  @MinLength(6, { message: "newPassword must have at least 6 characters." })
  newPassword: string;
}

export { RegisterUserDto, AuthUserDto, ForgotUserPasswordDto };
