import { IStock, IStockCreate } from "../@types/types";

export abstract class StockInterface {
  abstract create(userId: string, stock: IStockCreate): Promise<IStock>;

  abstract getAll(
    userId: string,
    page: number,
  ): Promise<{
    page: number;
    totalStocks: number;
    stocks: IStock[];
  }>;
}
