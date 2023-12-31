import { IUserCreation, IUser, IUserUpdate } from "src/@types/types";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UserInterface } from "./user.interface";
import { UserAttatchmentsInterface } from "../user-attatchments/user-attatchments.interface";

@Injectable()
export class InMemoryUser implements UserInterface {
  constructor(
    private readonly inMemoryUserAttatchments: UserAttatchmentsInterface
  ) {}

  private users = [] as IUser[];

  async create({
    email,
    fullName,
    password,
    secretAnswer,
    secretQuestion,
    role = "default",
  }: IUserCreation): Promise<IUser> {
    const newUser: IUser = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      role,
      fullName,
      email,
      password,
      secretAnswer,
      secretQuestion,
    };

    const attatchment = await this.inMemoryUserAttatchments.create(newUser.id);

    newUser.userAttatchments = Array(attatchment);

    this.users.push(newUser);

    return newUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const findUser = this.users.find((user) => user.email === email);

    if (!findUser) return null;

    return findUser;
  }

  async findById(userId: string): Promise<IUser | null> {
    const findUser = this.users.find((user) => user.id === userId);

    if (!findUser) return null;

    const getUserAttatchment = await this.inMemoryUserAttatchments.findByUserId(
      findUser.id
    );

    const formatUser: IUser = {
      ...findUser,
      userAttatchments: [getUserAttatchment],
    };

    return formatUser;
  }

  async updatePassword(userEmail: string, newPassword: string): Promise<IUser> {
    let userUpdated = {} as IUser;

    const updatedUsers = this.users.map((user) => {
      if (user.email === userEmail) {
        user.password = newPassword;

        userUpdated = user;
      }

      return user;
    });

    this.users = updatedUsers;

    return userUpdated;
  }

  async update(userId: string, update: IUserUpdate): Promise<IUser> {
    let userUpdated = {} as IUser;

    const updateList = this.users.map((user) => {
      if (user.id === userId) {
        user = {
          ...user,
          ...update,
          updatedAt: new Date(),
        };

        userUpdated = user;
      }

      return user;
    });

    this.users = updateList;

    return userUpdated;
  }
}
