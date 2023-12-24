import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async registerUserController(
    @Body(ValidationPipe)
    registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ) {
    await this.userService.registerUserService(registerUserDto);

    return res
      .status(HttpStatus.CREATED)
      .send({ message: 'User registered successfully!' });
  }
}
