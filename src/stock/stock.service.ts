import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StockInterface } from "./stock.interface";
import { UserInterface } from "../user/user.interface";
import { IStock, IStockCreate } from "../@types/types";

@Injectable()
export class StockService {
  constructor(
    private readonly userInterface: UserInterface,
    private readonly stockInterface: StockInterface,
  ) {}

  async createStock(userId: string, stock: IStockCreate): Promise<IStock> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const hasStoreWithThisName = await this.stockInterface.getByStockName(
      stock.stockName,
      userId,
    );

    if (hasStoreWithThisName) {
      throw new ConflictException(
        "An stock this name is already created on this account.",
      );
    }

    const stockCreation = await this.stockInterface.create(userId, stock);

    return stockCreation;
  }

  async getAllAccountStocks(
    userId: string,
    page: number,
  ): Promise<{
    page: number;
    totalStocks: number;
    stocks: IStock[];
  }> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (page < 1) {
      page = 1;
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getAllStocks = await this.stockInterface.getAll(userId, page);

    return getAllStocks;
  }
}
