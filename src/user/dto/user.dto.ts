import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

class RegisterUserDto {
  @IsString()
  @MinLength(6, { message: "fullName must have at least 6 characters." })
  fullName: string;

  @IsEmail({}, { message: "email must be an valid e-mail." })
  email: string;

  @IsString({ message: "password must be an string type." })
  @MinLength(6, { message: "password must have at least 6 characters." })
  password: string;

  @IsString()
  @MinLength(5, { message: "secretQuestion must have at least 6 characters." })
  secretQuestion: string;

  @IsString()
  @MinLength(5, { message: "secretAnswer must have at least 6 characters." })
  secretAnswer: string;
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

  @IsString()
  @MinLength(5, { message: "secretAnswer must have at least 6 characters." })
  secretAnswer: string;
}

class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(6, { message: "fullName must have at least 6 characters." })
  fullName: string;

  @IsOptional()
  @IsEmail({}, { message: "email must be an valid e-mail." })
  email: string;

  @IsOptional()
  @IsString({ message: "password must be an string type." })
  @MinLength(6, { message: "password must have at least 6 characters." })
  password: string;
}

class GetUserByIdDto {
  @IsOptional()
  @IsUUID()
  userId: string;
}

export {
  GetUserByIdDto,
  RegisterUserDto,
  AuthUserDto,
  ForgotUserPasswordDto,
  UpdateUserProfileDto,
};
