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
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";
import { ItemInterface } from "../../../item/item.interface";
import { InMemoryItem } from "../../../item/item.in-memory";

describe("Filter stock item by id service", () => {
  let sut: StockItemService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;

  let inMemoryCategory: InMemoryCategory;
  let inMemoryStock: InMemoryStock;
  let inMemoryItem: InMemoryItem;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: StockInterface, useClass: InMemoryStock },
        { provide: CategoryInterface, useClass: InMemoryCategory },
        { provide: StockItemInterface, useClass: InMemoryStockItem },
        { provide: UserAttatchmentsInterface, useClass: InMemoryUserAttatchments },
        { provide: ItemInterface, useClass: InMemoryItem },
        UserService,
        StockItemService,
      ],
    }).compile();

    sut = module.get<StockItemService>(StockItemService);
    userService = module.get<UserService>(UserService);
    inMemoryCategory = module.get(CategoryInterface);
    inMemoryStock = module.get(StockInterface);
    inMemoryItem = module.get(ItemInterface);

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

  it("should filter stock item by its id", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    const insertItem = await sut.insertStockItem(user.id, newStock.id, {
      categoryId: category.id,
      itemName: "Green Apple",
      quantity: 1,
      stockId: newStock.id,
      description: "Simple green apple",
    });

    const filterItem = await sut.filterStockItemById(
      user.id,
      newStock.id,
      insertItem.id
    );

    expect(filterItem).toEqual({
      id: insertItem.id,
      itemName: "Green Apple",
      quantity: 1,
      stockId: newStock.id,
      description: "Simple green apple",
      categoryId: category.id,
      createdAt: insertItem.createdAt,
      updatedAt: insertItem.updatedAt,
    });
  });

  it("should not filter stock item by its id without correctly provided params", async () => {
    await expect(() => {
      return sut.filterStockItemById("", "Any stock id", "Any item id");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.filterStockItemById(user.id, "", "Any item id");
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));

    await expect(() => {
      return sut.filterStockItemById(user.id, "Any stock id", "");
    }).rejects.toEqual(new BadRequestException("Invalid stock item id."));
  });

  it("should not filter stock item by its id if user doesn't exists", async () => {
    await expect(() => {
      return sut.filterStockItemById(
        "Inexistent user",
        "Any stock id",
        "Any item id"
      );
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not filter stock item by its id if stock doesn't exists", async () => {
    await expect(() => {
      return sut.filterStockItemById(user.id, "Inexistent stock", "Any item id");
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });

  it("should not filter stock item by its id if stock item doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.filterStockItemById(user.id, newStock.id, "Inexistent item stock");
    }).rejects.toEqual(new NotFoundException("Stock item not found."));
  });
});
