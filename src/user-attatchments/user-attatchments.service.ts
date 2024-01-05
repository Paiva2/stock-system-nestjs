import { BadRequestException, Injectable } from "@nestjs/common";
import { UserInterface } from "../user/user.interface";
import { UserAttatchmentsInterface } from "./user-attatchments.interface";

@Injectable()
export class UserAttatchmentsService {
  constructor(
    private readonly userInterface: UserInterface,
    private readonly userAttatchmentsInterface: UserAttatchmentsInterface
  ) {}

  async create(userId: string) {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }
  }
}
