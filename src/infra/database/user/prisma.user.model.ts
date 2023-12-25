import { Injectable } from "@nestjs/common";
import { IUserCreation, IUser } from "src/@types/types";
import { UserInterface } from "../../../user/user.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserModel implements UserInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ email, fullName, password }: IUserCreation): Promise<IUser> {
    const createUser = await this.prismaService.user.create({
      data: {
        email,
        fullName,
        password,
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
    });

    if (!findUserById) return null;

    return findUserById;
  }
}
