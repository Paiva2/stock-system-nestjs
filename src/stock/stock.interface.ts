import { IStock, IStockCreate } from "../@types/types";

export abstract class StockInterface {
  abstract create(userId: string, stock: IStockCreate): Promise<IStock>;
}
