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
}
