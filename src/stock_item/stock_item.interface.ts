import { IStockItem, IStockItemCreate } from "../@types/types";

export abstract class StockItemInterface {
  abstract insert(stockItem: IStockItemCreate): Promise<IStockItem>;
}
