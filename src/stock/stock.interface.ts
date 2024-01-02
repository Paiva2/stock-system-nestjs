import { IStock, IStockCreate, IStockUpdate } from "../@types/types";

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

  abstract getByStockName(
    stockName: string,
    userId: string,
  ): Promise<IStock | null>;

  abstract delete(stockId: string, userId: string): Promise<IStock | null>;

  abstract getById(stockId: string): Promise<IStock | null>;

  abstract update(userId: string, stock: IStockUpdate): Promise<IStock | null>;

  abstract getActives(
    userId: string,
    page: number,
  ): Promise<{
    page: number;
    totalStocks: number;
    stocks: IStock[];
  }>;

  abstract getInactives(
    userId: string,
    page: number,
  ): Promise<{
    page: number;
    totalStocks: number;
    stocks: IStock[];
  }>;
}
