import { IUserCreation, IUser } from "src/@types/types";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UserInterface } from "./user.interface";

@Injectable()
export class InMemoryUser implements UserInterface {
  private users = [] as IUser[];

  async create({ email, fullName, password }: IUserCreation): Promise<IUser> {
    const newUser = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "default",
      fullName,
      email,
      password,
    };

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

    return findUser;
  }
}
