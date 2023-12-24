import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";
import { AuthUserDto, RegisterUserDto } from "./dto/user.dto";
import { AuthService } from "../infra/http/auth/auth.service";

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  async registerUserController(
    @Body(ValidationPipe)
    registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ) {
    await this.userService.registerUserService(registerUserDto);

    return res
      .status(HttpStatus.CREATED)
      .send({ message: "User registered successfully!" });
  }

  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async authUserController(
    @Body(ValidationPipe) authUserDto: AuthUserDto,
    @Res() res: Response,
  ) {
    const getUser = await this.userService.authUserService(authUserDto);

    const authToken = await this.authService.generateToken(getUser.id);

    return res.status(HttpStatus.OK).send(authToken);
  }
}
