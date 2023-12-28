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
}
