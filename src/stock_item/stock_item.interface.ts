import { IStockItem, IStockItemCreate, IStockItemUpdate } from "../@types/types";

export abstract class StockItemInterface {
  abstract insert(stockItem: IStockItemCreate): Promise<IStockItem>;

  abstract remove(stockId: string, stockItemId: string): Promise<IStockItem | null>;

  abstract getAll(): Promise<IStockItem[]>;

  abstract getByStockId(stockId: string): Promise<IStockItem[]>;

  abstract updateById(stockItem: IStockItemUpdate): Promise<IStockItem | null>;

  abstract getManyById(stockIds: string[]): Promise<IStockItem[]>;
}
