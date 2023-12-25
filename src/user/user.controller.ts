import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { AuthUserDto, RegisterUserDto } from "./dto/user.dto";
import { AuthService } from "../infra/http/auth/auth.service";
import { AuthGuard } from "../infra/http/auth/auth.guard";

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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get("/profile")
  async getUserProfileController(@Res() res: Response, @Req() req: Request) {
    const tokenParsed: { sub: string; iat: number; exp: number } = req["user"];

    const getUser = await this.userService.getUserProfile(tokenParsed.sub);

    return res.status(HttpStatus.OK).send(getUser);
  }
}
