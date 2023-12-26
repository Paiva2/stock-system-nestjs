import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { IUser, IUserCreation } from "src/@types/types";
import { UserInterface } from "./user.interface";
import { compare, hash } from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userInterface: UserInterface) {}

  async registerUserService(user: IUserCreation): Promise<IUser> {
    if (!user.fullName) {
      throw new BadRequestException("Full name must be provided.");
    }

    if (!user.email) {
      throw new BadRequestException("E-mail must be provided.");
    }

    if (!user.secretAnswer || !user.secretQuestion) {
      throw new BadRequestException(
        "Security question and answer must be provided.",
      );
    }

    if (user.password.length < 6) {
      throw new BadRequestException(
        "Password must have at least 6 characters.",
      );
    }

    const isUserRegistered = await this.userInterface.findByEmail(user.email);

    if (isUserRegistered) {
      throw new ConflictException("User is already registered.");
    }

    const hashPassword = await hash(user.password, 8);

    const createUser = await this.userInterface.create({
      ...user,
      password: hashPassword,
    });

    return createUser;
  }

  async authUserService(user: {
    email: string;
    password: string;
  }): Promise<IUser> {
    if (!user.email) {
      throw new BadRequestException("Invalid e-mail provided.");
    }

    if (!user.password) {
      throw new BadRequestException("Invalid password provided.");
    }

    if (user.password.length < 6) {
      throw new BadRequestException(
        "Password must have at least 6 characters.",
      );
    }

    const getUser = await this.userInterface.findByEmail(user.email);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const matchPasswords = await compare(user.password, getUser.password);

    if (!matchPasswords) {
      throw new ForbiddenException("Invalid credentials.");
    }

    delete getUser.password;

    return getUser;
  }

  async getUserProfile(userId: string): Promise<IUser> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const doesUserExists = await this.userInterface.findById(userId);

    if (!doesUserExists) {
      throw new NotFoundException("User not found.");
    }

    delete doesUserExists.password;

    return doesUserExists;
  }

  async forgotUserPassword(
    userEmail: string,
    newPassword: string,
  ): Promise<IUser> {
    if (!userEmail) {
      throw new BadRequestException("Invalid user email.");
    }

    if (!newPassword) {
      throw new BadRequestException("Invalid new password.");
    }

    if (newPassword.length < 6) {
      throw new BadRequestException(
        "New password must have at least 6 characters.",
      );
    }

    const getUser = await this.userInterface.findByEmail(userEmail);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const hashNewPassword = await hash(newPassword, 8);

    const updateUserPassword = await this.userInterface.updatePassword(
      userEmail,
      hashNewPassword,
    );

    return updateUserPassword;
  }
}
