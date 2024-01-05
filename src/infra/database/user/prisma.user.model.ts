import { Injectable } from "@nestjs/common";
import { IUserCreation, IUser, IUserUpdate } from "src/@types/types";
import { UserInterface } from "../../../user/user.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserModel implements UserInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    email,
    fullName,
    password,
    secretAnswer,
    secretQuestion,
  }: IUserCreation): Promise<IUser> {
    const createUser = await this.prismaService.user.create({
      data: {
        email,
        fullName,
        password,
        secretAnswer,
        secretQuestion,
      },
    });

    return createUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const findByEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!findByEmail) return null;

    return findByEmail;
  }

  async findById(userId: string): Promise<IUser | null> {
    const findUserById = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userAttatchments: true,
      },
    });

    if (!findUserById) return null;

    return findUserById;
  }

  async updatePassword(userEmail: string, newPassword: string): Promise<IUser> {
    const update = await this.prismaService.user.update({
      where: {
        email: userEmail,
      },
      data: {
        password: newPassword,
      },
    });

    return update;
  }

  async update(userId: string, update: IUserUpdate): Promise<IUser> {
    const updateUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: update,
    });

    return updateUser;
  }
}
