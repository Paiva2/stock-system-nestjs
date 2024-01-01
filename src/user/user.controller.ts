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
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
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
  ) {
    await this.userService.registerUserService(registerUserDto);

    return { message: "User registered successfully!" };
  }

  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async authUserController(@Body(ValidationPipe) authUserDto: AuthUserDto) {
    const getUser = await this.userService.authUserService(authUserDto);

    const authToken = await this.authService.generateToken(getUser.id);

    return authToken;
  }

  @UseGuards(AuthGuard)
  @Get("/profile")
  async getUserProfileController(@Req() req: Request) {
    const tokenParsed: IJwtSchema = req["user"];

    const getUser = await this.userService.getUserProfile(tokenParsed.sub);

    return getUser;
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/forgot-password")
  async forgotUserPasswordController(
    @Body(ValidationPipe) forgotUserPasswordDto: ForgotUserPasswordDto,
  ) {
    const { email, newPassword, secretAnswer } = forgotUserPasswordDto;

    await this.userService.forgotUserPassword(email, newPassword, secretAnswer);

    return { message: "Password updated successfully." };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch("/profile")
  async updateUserProfileController(
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: Request,
  ) {
    const updateFields = updateUserProfileDto;

    const tokenParsed: IJwtSchema = req["user"];

    await this.userService.updateUserProfile(tokenParsed.sub, updateFields);

    return { message: "Profile updated successfully." };
  }

  @Get("/profile/:userId")
  async getUserByIdController(@Param(ValidationPipe) params: GetUserByIdDto) {
    const getUser = await this.userService.getUserById(params.userId);

    return getUser;
  }
}
