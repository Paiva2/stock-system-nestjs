import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { UserInterface } from "../../../user/user.interface";
import { StockInterface } from "../../../stock/stock.interface";
import { StockItemInterface } from "../../stock_item.interface";
import { CategoryInterface } from "../../../category/category.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryStock } from "../../../stock/stock.in-memory";
import { InMemoryStockItem } from "../../stock_item.in-memory";
import { InMemoryCategory } from "../../../category/category.in-memory";
import { UserService } from "../../../user/user.service";
import { StockItemService } from "../../stock_item.service";

describe("Edit stock item service", () => {
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

  it("should edit an stock item", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create("Apples");

    const diffCategory = await inMemoryCategory.create("Fruits");

    const insertItem = await sut.insertStockItem(user.id, newStock.id, {
      categoryId: category.id,
      itemName: "Green Apple",
      quantity: 1,
      stockId: newStock.id,
      description: "Simple green apple",
    });

    const editItem = await sut.editStockItem(user.id, newStock.id, {
      id: insertItem.id,
      description: "Change description",
      itemName: "Red Apple",
      quantity: 20,
      categoryId: diffCategory.id,
    });

    expect(editItem).toEqual({
      id: insertItem.id,
      itemName: "Red Apple",
      quantity: 20,
      stockId: newStock.id,
      description: "Change description",
      categoryId: diffCategory.id,
      createdAt: insertItem.createdAt,
      updatedAt: insertItem.updatedAt,
    });
  });

  it("should not edit an stock item without correctly provided params", async () => {
    await expect(() => {
      return sut.editStockItem("", "valid stock id", {
        id: "valid stock item id",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.editStockItem(user.id, "", {
        id: "valid stock item id",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
      });
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));

    await expect(() => {
      return sut.editStockItem(user.id, "valid stock id", {
        id: "",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
      });
    }).rejects.toEqual(new BadRequestException("Invalid stock item id."));
  });

  it("should not edit an stock item if user does't exists", async () => {
    await expect(() => {
      return sut.editStockItem("Inexistent user id", "valid stock id", {
        id: "valid stock item id",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not edit an stock item if stock does't exists", async () => {
    await expect(() => {
      return sut.editStockItem(user.id, "Inexistent stock id", {
        id: "valid stock item id",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
      });
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });

  it("should not edit an stock item category if category id doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.editStockItem(user.id, newStock.id, {
        id: "valid stock item id",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
        categoryId: "inexistent category id",
      });
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });

  it("should not edit an stock item category if stock item doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create("Apples");

    await expect(() => {
      return sut.editStockItem(user.id, newStock.id, {
        id: "inexistent stock item id",
        description: "Change description",
        itemName: "Red Apple",
        quantity: 20,
        categoryId: category.id,
      });
    }).rejects.toEqual(new NotFoundException("Stock item not found."));
  });
});
