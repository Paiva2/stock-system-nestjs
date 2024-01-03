import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { UserService } from "../../../user/user.service";
import { InMemoryUser } from "../../../user/user.in-memory";
import { UserInterface } from "../../../user/user.interface";
import { StockInterface } from "../../../stock/stock.interface";
import { InMemoryStock } from "../../../stock/stock.in-memory";
import { CategoryInterface } from "../../../category/category.interface";
import { InMemoryCategory } from "../../../category/category.in-memory";
import { StockItemInterface } from "../../stock_item.interface";
import { InMemoryStockItem } from "../../stock_item.in-memory";
import { StockItemService } from "../../stock_item.service";

describe("Remove stock item service", () => {
  let sut: StockItemService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;

  let inMemoryCategory: InMemoryCategory;
  let inMemoryStock: InMemoryStock;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: StockInterface, useClass: InMemoryStock },
        { provide: CategoryInterface, useClass: InMemoryCategory },
        { provide: StockItemInterface, useClass: InMemoryStockItem },
        UserService,
        StockItemService,
      ],
    }).compile();

    sut = module.get<StockItemService>(StockItemService);
    userService = module.get<UserService>(UserService);
    inMemoryCategory = module.get(CategoryInterface);
    inMemoryStock = module.get(StockInterface);

    user = await userService.registerUserService({
      email: "johndoe@email.com",
      fullName: "John Doe",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
    });
  });

  it("should init module correctly for tests", () => {
    expect(sut).toBeDefined();
  });

  it("should remove an stock item from stock", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create("Apples");

    const stockItem = await sut.insertStockItem(user.id, newStock.id, {
      categoryId: category.id,
      itemName: "Green Apple",
      quantity: 1,
      stockId: newStock.id,
      description: "Simple green apple",
    });

    const removedItem = await sut.removeStockItem(
      user.id,
      stockItem.id,
      newStock.id
    );

    expect(removedItem).toEqual({
      id: stockItem.id,
      itemName: "Green Apple",
      quantity: 1,
      stockId: newStock.id,
      description: "Simple green apple",
      categoryId: category.id,
      createdAt: stockItem.createdAt,
      updatedAt: stockItem.updatedAt,
    });
  });

  it("should not remove an stock item from stock without correctly provided params", async () => {
    await expect(() => {
      return sut.removeStockItem("", "any stock item id", "any stock id");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.removeStockItem("any user id", "any stock item id", "");
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));

    await expect(() => {
      return sut.removeStockItem("any user id", "", "any stock id");
    }).rejects.toEqual(new BadRequestException("Invalid stock item id."));
  });

  it("should not remove an stock item from stock if user doesn't exists", async () => {
    await expect(() => {
      return sut.removeStockItem(
        "Inexistent user id",
        "any stock item id",
        "any stock id"
      );
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not remove an stock item from stock if stock doesn't exists", async () => {
    await expect(() => {
      return sut.removeStockItem(
        user.id,
        "any stock item id",
        "Inexistent stock id"
      );
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });

  it("should not remove an stock item from stock if stock item doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.removeStockItem(user.id, "inexistent stock item id", newStock.id);
    }).rejects.toEqual(new NotFoundException("Stock item not found."));
  });
});
