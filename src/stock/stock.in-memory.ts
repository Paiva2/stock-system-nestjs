import { randomUUID } from "crypto";
import { IStock, IStockCreate, IStockUpdate } from "../@types/types";
import { StockInterface } from "./stock.interface";
import { Injectable } from "@nestjs/common";
import { StockItemInterface } from "../stock_item/stock_item.interface";

@Injectable()
export class InMemoryStock implements StockInterface {
  constructor(private readonly inMemoryStockItem: StockItemInterface) {}

  private stocks = [] as IStock[];

  async create(userId: string, stock: IStockCreate): Promise<IStock> {
    const newStock = {
      id: randomUUID(),
      stockName: stock.stockName,
      stockOwner: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
      totalItems: 0,
    };

    this.stocks.push(newStock);

    return newStock;
  }

  async getAll(
    userId: string,
    page: number
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const getAllStocks = this.stocks.filter((stock) => stock.stockOwner === userId);

    const perPage = 10;

    const paginatedStocks = getAllStocks
      .map((stock) => {
        stock.totalItems = 0;

        return stock;
      })
      .splice((page - 1) * perPage, page * perPage);

    const stockIds = paginatedStocks.map((stock) => stock.id);

    const getAllStockIdItems = await this.inMemoryStockItem.getManyById(stockIds);

    if (getAllStockIdItems.length) {
      getAllStockIdItems.forEach((item) => {
        const getItemStock = paginatedStocks.find(
          (stock) => stock.id === item.stockId
        );

        if (getItemStock) {
          getItemStock.totalItems++;
        }
      });
    }

    return {
      page,
      stocks: paginatedStocks,
      totalStocks: paginatedStocks.length,
    };
  }

  async getByStockName(stockName: string, userId: string): Promise<IStock> {
    const findByName = this.stocks.find(
      (stock) => stock.stockName === stockName && stock.stockOwner === userId
    );

    if (!findByName) return null;

    return findByName;
  }

  async delete(stockId: string, userId: string): Promise<IStock | null> {
    const stockToDelete = this.stocks.find(
      (stock) => stock.id === stockId && stock.stockOwner === userId
    );

    if (!stockToDelete) return null;

    const getStockToDeleteIdx = this.stocks.indexOf(stockToDelete);

    this.stocks.splice(getStockToDeleteIdx, 1);

    return stockToDelete;
  }

  async getById(stockId: string): Promise<IStock> {
    const getStockById = this.stocks.find((stock) => stock.id === stockId);

    if (!getStockById) return null;

    return getStockById;
  }

  async update(userId: string, stock: IStockUpdate): Promise<IStock | null> {
    let updatedStock: IStock | null = null;

    const updateStocksList = this.stocks.map((stockToUpdate) => {
      if (stockToUpdate.stockOwner === userId && stockToUpdate.id === stock.id) {
        stockToUpdate = {
          ...stockToUpdate,
          ...stock,
        };

        updatedStock = stockToUpdate;
      }

      return stockToUpdate;
    });

    this.stocks = updateStocksList;

    return updatedStock;
  }

  async getByStatus(
    userId: string,
    page: number,
    active: boolean
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const findStocks = this.stocks.filter((stock) => {
      const filterByStatus = active ? stock.active : !stock.active;

      return filterByStatus && stock.stockOwner === userId;
    });

    const perPage = 10;
    const totalStocks = findStocks.length;

    let stocksPaginated = findStocks
      .map((stock) => {
        stock.totalItems = 0;

        return stock;
      })
      .splice((page - 1) * perPage, perPage * page);

    const getStocksIds = stocksPaginated.map((stock) => stock.id);

    const getStockItems = await this.inMemoryStockItem.getManyById(getStocksIds);

    if (getStockItems.length) {
      getStockItems.forEach((item) => {
        const getItemStock = stocksPaginated.find(
          (stock) => stock.id === item.stockId
        );

        if (getItemStock) {
          getItemStock.totalItems++;
        }

        return item;
      });
    }

    return {
      page,
      totalStocks,
      stocks: stocksPaginated,
    };
  }

  async getInactives(
    userId: string,
    page: number
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const findStocks = this.stocks.filter(
      (stock) => stock.active === false && stock.stockOwner === userId
    );

    const perPage = 10;
    const totalStocks = findStocks.length;

    return {
      page,
      totalStocks,
      stocks: findStocks.splice((page - 1) * perPage, perPage * page),
    };
  }
}
