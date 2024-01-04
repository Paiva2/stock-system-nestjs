import { randomUUID } from "crypto";
import {
  IStockItemCreate,
  IStockItem,
  IStockItemUpdate,
  IStock,
} from "../@types/types";
import { StockItemInterface } from "./stock_item.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
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
      (item) => item.id === stockItemId && item.stockId === stockId
    );

    if (!getItemToRemove) return null;

    return getItemToRemove;
  }

  async getAll(): Promise<IStockItem[]> {
    return this.stockItems;
  }

  async getByStockId(stockId: string): Promise<IStockItem[]> {
    const getStockItems = this.stockItems.filter((item) => item.stockId === stockId);

    return getStockItems;
  }

  async updateById(stockItemId: IStockItemUpdate): Promise<IStockItem> {
    let findItem: IStockItem;

    const updateStockItemsList = this.stockItems.map((item) => {
      if (item.id === stockItemId.id) {
        item = {
          ...item,
          ...stockItemId,
        };

        findItem = item;
      }

      return item;
    });

    if (!findItem) return null;

    this.stockItems = updateStockItemsList;

    return findItem;
  }
}
