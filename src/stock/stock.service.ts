import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { IStock, IStockCreate, IStockUpdate } from "../@types/types";

import { StockItemInterface } from "../stock_item/stock_item.interface";
import { CategoryInterface } from "../category/category.interface";
import { UserInterface } from "../user/user.interface";
import { StockInterface } from "./stock.interface";

@Injectable()
export class StockService {
  constructor(
    private readonly userInterface: UserInterface,
    private readonly stockInterface: StockInterface,
    private readonly stockItemInterface: StockItemInterface,
    private readonly categoryInterface: CategoryInterface
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
      userId
    );

    if (hasStoreWithThisName) {
      throw new ConflictException(
        "An stock this name is already created on this account."
      );
    }

    const stockCreation = await this.stockInterface.create(userId, stock);

    return stockCreation;
  }

  async getAllAccountStocks(
    userId: string,
    page: number
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

  async getStockById(userId: string, stockId: string) {
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

    const getStockItems = await this.stockItemInterface.getByStockId(
      getStockById.id
    );

    let stockItemsCategories: string[] = [];

    getStockItems.forEach((item) => {
      const isCategoryAlreadyAdded = stockItemsCategories.find(
        (category) => category === item.categoryId
      );

      if (!isCategoryAlreadyAdded) {
        stockItemsCategories.push(item.categoryId);
      }
    });

    const getCategories =
      await this.categoryInterface.findManyById(stockItemsCategories);

    const formatStockItemsInformations = getStockItems.map((item) => {
      const findItemCategory = getCategories.find(
        (category) => category.id === item.categoryId
      );

      if (findItemCategory) {
        item.categoryName = findItemCategory.name;
      }

      return item;
    });

    const totalItems = formatStockItemsInformations.length;

    const totalItemsQuantity = formatStockItemsInformations.reduce(
      (acc, item) => (acc += item.quantity),
      0
    );

    return {
      ...getStockById,
      totalItems,
      totalItemsQuantity,
      stockItems: formatStockItemsInformations,
    };
  }

  async updateStock(userId: string, stock: IStockUpdate): Promise<IStock> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!stock.id) {
      throw new BadRequestException("Invalid stock id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const updateStock = await this.stockInterface.update(userId, stock);

    if (!updateStock) {
      throw new NotFoundException("Stock not found.");
    }

    return updateStock;
  }

  async filterStocks(
    userId: string,
    active: boolean,
    page: number
  ): Promise<{
    page: number;
    totalStocks: number;
    stocks: IStock[];
    active: boolean;
  }> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (active === undefined || active === null) {
      throw new BadRequestException("Active must be true or false.");
    }

    if (page < 1) page = 1;

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    let stocksMetadata: {
      page: number;
      totalStocks: number;
      stocks: IStock[];
    };

    if (active) {
      stocksMetadata = await this.stockInterface.getActives(userId, page);
    } else {
      stocksMetadata = await this.stockInterface.getInactives(userId, page);
    }

    const getAllStockItems = await this.stockItemInterface.getAll();

    if (getAllStockItems.length) {
      getAllStockItems.forEach((item) => {
        const getItemStock = stocksMetadata.stocks.find(
          (stock) => stock.id === item.stockId
        );

        if (getItemStock) {
          getItemStock.totalItems++;
          getItemStock.totalItemsQuantity += item.quantity;
        }
      });
    } else {
      stocksMetadata.stocks.map((stock) => {
        stock.totalItems = 0;
        stock.totalItemsQuantity = 0;

        return stock;
      });
    }

    return {
      active,
      ...stocksMetadata,
    };
  }
}
