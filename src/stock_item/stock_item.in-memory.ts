import { randomUUID } from "crypto";
import { IStockItemCreate, IStockItem } from "../@types/types";
import { StockItemInterface } from "./stock_item.interface";

export class InMemoryStockItem implements StockItemInterface {
  private stockItems = [] as IStockItem[];

  async insert(stockItem: IStockItemCreate): Promise<IStockItem> {
    const newStockItem = {
      id: randomUUID(),
      itemName: stockItem.itemName,
      quantity: stockItem.quantity,
      stockId: stockItem.stockId,
      description: stockItem.description ?? undefined,
      categoryId: stockItem.categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.stockItems.push(newStockItem);

    return newStockItem;
  }
}
