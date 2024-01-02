import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { IStockItemCreate } from "../@types/types";
import { UserInterface } from "../user/user.interface";
import { StockInterface } from "../stock/stock.interface";
import { CategoryInterface } from "../category/category.interface";
import { StockItemInterface } from "./stock_item.interface";

@Injectable()
export class StockItemService {
  constructor(
    private readonly userInterface: UserInterface,
    private readonly stockInterface: StockInterface,
    private readonly categoryInterface: CategoryInterface,
    private readonly stockItemInterface: StockItemInterface,
  ) {}

  async insertStockItem(
    userId: string,
    stockId: string,
    stockItem: IStockItemCreate,
  ) {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!stockId) {
      throw new BadRequestException("Invalid stock id.");
    }

    if (!stockItem.stockId || !stockItem.categoryId) {
      throw new BadRequestException(
        "You must provide an valid stock id and category id.",
      );
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getStock = await this.stockInterface.getById(stockId);

    if (!getStock) {
      throw new NotFoundException("Stock not found.");
    }

    if (getStock.stockOwner !== userId) {
      throw new ForbiddenException(
        "You must be the stock owner to insert item on it.",
      );
    }

    const getCategory = await this.categoryInterface.findById(
      stockItem.categoryId,
    );

    if (!getCategory) {
      throw new NotFoundException("Category not found.");
    }

    const insertStockItem = await this.stockItemInterface.insert({
      categoryId: stockItem.categoryId,
      itemName: stockItem.itemName,
      quantity: stockItem.quantity,
      stockId,
      description: stockItem.description,
    });

    return insertStockItem;
  }
}
