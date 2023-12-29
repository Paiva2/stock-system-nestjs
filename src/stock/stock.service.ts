import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { IStock, IStockCreate } from "../@types/types";
import { StockInterface } from "./stock.interface";
import { UserInterface } from "../user/user.interface";

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

  async deleteAccountStock(userId: string, stockId: string): Promise<IStock> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!stockId) {
      throw new BadRequestException("Invalid stock id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const deletedStock = await this.stockInterface.delete(stockId, userId);

    if (!deletedStock) {
      throw new NotFoundException("Stock not found.");
    }

    return deletedStock;
  }

  async getStockById(userId: string, stockId: string): Promise<IStock> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!stockId) {
      throw new BadRequestException("Invalid stock id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getStockById = await this.stockInterface.getById(stockId);

    if (!getStockById) {
      throw new NotFoundException("Stock not found.");
    }

    if (getStockById.stockOwner !== userId) {
      throw new ForbiddenException("Invalid permissions.");
    }

    return getStockById;
  }
}
