import { randomUUID } from "crypto";
import { IStock, IStockCreate } from "../@types/types";
import { StockInterface } from "./stock.interface";

export class InMemoryStock implements StockInterface {
  private stocks = [] as IStock[];

  async create(userId: string, stock: IStockCreate): Promise<IStock> {
    const newStock = {
      id: randomUUID(),
      stockName: stock.stockName,
      stockOwner: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.stocks.push(newStock);

    return newStock;
  }

  async getAll(
    userId: string,
    page: number,
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const getAllStocks = this.stocks.filter(
      (stock) => stock.stockOwner === userId,
    );

    const perPage = 10;

    const paginatedStocks = getAllStocks.splice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      page,
      stocks: paginatedStocks,
      totalStocks: paginatedStocks.length,
    };
  }

  async getByStockName(stockName: string, userId: string): Promise<IStock> {
    const findByName = this.stocks.find(
      (stock) => stock.stockName === stockName && stock.stockOwner === userId,
    );

    if (!findByName) return null;

    return findByName;
  }

  async delete(stockId: string, userId: string): Promise<IStock | null> {
    const stockToDelete = this.stocks.find(
      (stock) => stock.id === stockId && stock.stockOwner === userId,
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
}
