import { Injectable } from "@nestjs/common";
import { UserAttatchmentsInterface } from "./user-attatchments.interface";
import { IUserAttatchments } from "../@types/types";
import { randomUUID } from "crypto";

@Injectable()
export class InMemoryUserAttatchments implements UserAttatchmentsInterface {
  private userAttatchments = [] as IUserAttatchments[];

  async create(userId: string): Promise<IUserAttatchments> {
    const newUserAttatchment: IUserAttatchments = {
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: randomUUID(),
    };

    this.userAttatchments.push(newUserAttatchment);

    return newUserAttatchment;
  }

  async findByUserId(userId: string): Promise<IUserAttatchments | null> {
    const findAttatchment = this.userAttatchments.find(
      (attatchment) => attatchment.userId === userId
    );

    if (!findAttatchment) return null;

    return findAttatchment;
  }
}
