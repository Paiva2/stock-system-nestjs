import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StockInterface } from "./stock.interface";
import { UserInterface } from "../user/user.interface";
import { IStockCreate } from "../@types/types";

@Injectable()
export class StockService {
  constructor(
    private readonly userInterface: UserInterface,
    private readonly stockInterface: StockInterface,
  ) {}

  async createStock(userId: string, stock: IStockCreate) {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const stockCreation = await this.stockInterface.create(userId, stock);

    return stockCreation;
  }
}
