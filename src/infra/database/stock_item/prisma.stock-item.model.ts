import { Injectable } from "@nestjs/common";
import { IStockItemCreate, IStockItem } from "../../../@types/types";
import { StockItemInterface } from "../../../stock_item/stock_item.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStockItemModel implements StockItemInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(stockItem: IStockItemCreate): Promise<IStockItem> {
    const newStockItem = await this.prismaService.stockItem.create({
      data: stockItem,
    });

    return newStockItem;
  }
}
