import { Injectable } from "@nestjs/common";
import {
  IStockItemCreate,
  IStockItem,
  IStockItemUpdate,
} from "../../../@types/types";
import { StockItemInterface } from "../../../stock_item/stock_item.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStockItemModel implements StockItemInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(stockItem: IStockItemCreate): Promise<IStockItem> {
    const newStockItem = await this.prismaService.stockItem.create({
      data: {
        ...stockItem,
        stockId: stockItem.stockId,
      },
    });

    return newStockItem;
  }

  async remove(stockId: string, stockItemId: string): Promise<IStockItem | null> {
    try {
      const removedStockItem = await this.prismaService.stockItem.delete({
        where: {
          id: stockItemId,
          AND: {
            stockId,
          },
        },
      });

      return removedStockItem;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }

  async getAll(): Promise<IStockItem[]> {
    return this.prismaService.stockItem.findMany({});
  }

  async updateById(stockItem: IStockItemUpdate): Promise<IStockItem> {
    try {
      const editedStockItem = await this.prismaService.stockItem.update({
        where: {
          id: stockItem.id,
        },
        data: stockItem,
      });

      return editedStockItem;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }

  async getManyById(stockIds: string[]): Promise<IStockItem[]> {
    const findItems = await this.prismaService.stockItem.findMany({
      where: {
        id: { in: stockIds },
      },
    });

    return findItems;
  }

  async findById(stockId: string, stockItemId: string): Promise<IStockItem> {
    const findItemById = await this.prismaService.stockItem.findFirst({
      where: {
        id: stockItemId,
        AND: {
          stockId,
        },
      },
    });

    if (!findItemById) return null;

    return findItemById;
  }

  // USED ONLY ON INTEGRATION TESTS
  getAllFromStockId(stockId: string): Promise<IStockItem[]> {
    throw new Error("Method not implemented");
  }
}
