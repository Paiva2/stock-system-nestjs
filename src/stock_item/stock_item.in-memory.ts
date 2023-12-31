import { randomUUID } from "crypto";
import {
  IStockItemCreate,
  IStockItem,
  IStockItemUpdate,
  IStock,
} from "../@types/types";
import { Injectable } from "@nestjs/common";
import { StockItemInterface } from "./stock_item.interface";

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

  async updateById(stockItem: IStockItemUpdate): Promise<IStockItem> {
    let findItem: IStockItem;

    const updateStockItemsList = this.stockItems.map((item) => {
      if (item.id === stockItem.id) {
        item = {
          ...item,
          ...stockItem,
        };

        findItem = item;
      }

      return item;
    });

    if (!findItem) return null;

    this.stockItems = updateStockItemsList;

    return findItem;
  }

  async getManyById(stockIds: string[]): Promise<IStockItem[]> {
    const getStockItemsByIds = this.stockItems.filter((item) =>
      stockIds.includes(item.stockId)
    );

    return getStockItemsByIds;
  }

  async getAllFromStockId(stockId: string): Promise<IStockItem[]> {
    const findAllFromStock = this.stockItems.filter(
      (item) => item.stockId === stockId
    );

    return findAllFromStock;
  }

  async findById(stockId: string, stockItemId: string): Promise<IStockItem> {
    const findItem = this.stockItems.find(
      (item) => item.id === stockItemId && item.stockId === stockId
    );

    if (!findItem) return null;

    return findItem;
  }
}
