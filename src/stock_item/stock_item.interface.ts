import { IStockItem, IStockItemCreate } from "../@types/types";

export abstract class StockItemInterface {
  abstract insert(stockItem: IStockItemCreate): Promise<IStockItem>;

  abstract remove(
    stockId: string,
    stockItemId: string,
  ): Promise<IStockItem | null>;
}
