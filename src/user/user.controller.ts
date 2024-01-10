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
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
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
@ApiTags("User")
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @ApiBody({
    type: RegisterUserDto,
    examples: {
      registerDto: {
        value: {
          fullName: "John Doe",
          email: "johndoe@example.com",
          password: "123456",
          secretQuestion: "Favourite band",
          secretAnswer: "The Beatles",
        },
      },
    },
  })
  @Post("/register")
  async registerUserController(
    @Body(ValidationPipe)
    registerUserDto: RegisterUserDto
  ) {
    await this.userService.registerUserService(registerUserDto);

    return { message: "User registered successfully!" };
  }

  @ApiBody({
    type: AuthUserDto,
    examples: {
      authUserDto: {
        value: {
          email: "johndoe@example.com",
          password: "123456",
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async authUserController(@Body(ValidationPipe) authUserDto: AuthUserDto) {
    const getUser = await this.userService.authUserService(authUserDto);

    const authToken = await this.authService.generateToken(getUser.id);

    return authToken;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get("/profile")
  async getUserProfileController(@Req() req: Request) {
    const tokenParsed: IJwtSchema = req["user"];

    const getUser = await this.userService.getUserProfile(tokenParsed.sub);

    return getUser;
  }

  @ApiBody({
    type: ForgotUserPasswordDto,
    examples: {
      forgotUserPasswordDto: {
        value: {
          email: "johndoe@example.com",
          newPassword: "123456",
          secretAnswer: "My secret answer",
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Patch("/forgot-password")
  async forgotUserPasswordController(
    @Body(ValidationPipe) forgotUserPasswordDto: ForgotUserPasswordDto
  ) {
    const { email, newPassword, secretAnswer } = forgotUserPasswordDto;

    await this.userService.forgotUserPassword(email, newPassword, secretAnswer);

    return { message: "Password updated successfully." };
  }

  @ApiBody({
    type: UpdateUserProfileDto,
    examples: {
      updateUserProfileDto: {
        value: {
          fullName: "John Doe New",
          email: "johndoenew@example.com",
          password: "123456",
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch("/profile")
  async updateUserProfileController(
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: Request
  ) {
    const updateFields = updateUserProfileDto;

    const tokenParsed: IJwtSchema = req["user"];

    await this.userService.updateUserProfile(tokenParsed.sub, updateFields);

    return { message: "Profile updated successfully." };
  }

  @ApiParam({
    name: "userId",
    allowEmptyValue: false,
    examples: {
      getUserByIdDto: {
        value: "userId",
      },
    },
  })
  @Get("/profile/:userId")
  async getUserByIdController(@Param(ValidationPipe) params: GetUserByIdDto) {
    const getUser = await this.userService.getUserById(params.userId);

    return getUser;
  }
}
