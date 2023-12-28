import { Injectable } from "@nestjs/common";
import { IStockCreate, IStock } from "../../../@types/types";
import { StockInterface } from "../../../stock/stock.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStockModel implements StockInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, stock: IStockCreate): Promise<IStock> {
    const createStock = await this.prismaService.stock.create({
      data: {
        stockName: stock.stockName,
        stockOwner: userId,
      },
    });

    return createStock;
  }
}
