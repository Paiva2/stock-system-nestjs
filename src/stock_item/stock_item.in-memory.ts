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

  async remove(stockId: string, stockItemId: string): Promise<IStockItem> {
    const getItemToRemove = this.stockItems.find(
      (item) => item.id === stockItemId && item.stockId === stockId,
    );

    if (!getItemToRemove) return null;

    return getItemToRemove;
  }
}
