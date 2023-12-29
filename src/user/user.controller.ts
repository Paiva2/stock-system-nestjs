import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Request, Response } from "express";
import { IJwtSchema } from "../@types/types";
import {
  AuthUserDto,
  ForgotUserPasswordDto,
  GetUserByIdDto,
  RegisterUserDto,
  UpdateUserProfileDto,
} from "./dto/user.dto";
import { UserService } from "./user.service";
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
    const tokenParsed: IJwtSchema = req["user"];

    const getUser = await this.userService.getUserProfile(tokenParsed.sub);

    return res.status(HttpStatus.OK).send(getUser);
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/forgot-password")
  async forgotUserPasswordController(
    @Body(ValidationPipe) forgotUserPasswordDto: ForgotUserPasswordDto,
    @Res() res: Response,
  ) {
    const { email, newPassword, secretAnswer } = forgotUserPasswordDto;

    await this.userService.forgotUserPassword(email, newPassword, secretAnswer);

    return res
      .status(HttpStatus.OK)
      .send({ message: "Password updated successfully." });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch("/profile")
  async updateUserProfileController(
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const updateFields = updateUserProfileDto;

    const tokenParsed: IJwtSchema = req["user"];

    await this.userService.updateUserProfile(tokenParsed.sub, updateFields);

    return res
      .status(HttpStatus.OK)
      .send({ message: "Profile updated successfully." });
  }

  @HttpCode(HttpStatus.OK)
  @Get("/profile/:userId")
  async getUserByIdController(
    @Res() res: Response,
    @Param(ValidationPipe) params: GetUserByIdDto,
  ) {
    const getUser = await this.userService.getUserById(params.userId);

    return res.status(HttpStatus.OK).send(getUser);
  }
}
