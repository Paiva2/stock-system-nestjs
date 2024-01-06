import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { StockInterface } from "../../stock.interface";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryStock } from "../../stock.in-memory";
import { StockService } from "../../stock.service";
import { UserService } from "../../../user/user.service";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";
import { StockItemInterface } from "../../../stock_item/stock_item.interface";
import { CategoryInterface } from "../../../category/category.interface";
import { InMemoryStockItem } from "../../../stock_item/stock_item.in-memory";
import { InMemoryCategory } from "../../../category/category.in-memory";

describe("Get stock by id service", () => {
  let sut: StockService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;
  let inMemoryStockItem: StockItemInterface;
  let inMemoryCategory: CategoryInterface;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: StockInterface, useClass: InMemoryStock },
        { provide: StockItemInterface, useClass: InMemoryStockItem },
        { provide: CategoryInterface, useClass: InMemoryCategory },
        { provide: UserAttatchmentsInterface, useClass: InMemoryUserAttatchments },
        StockService,
        UserService,
      ],
    }).compile();

    sut = module.get<StockService>(StockService);

    userService = module.get<UserService>(UserService);

    inMemoryStockItem = module.get<StockItemInterface>(StockItemInterface);

    inMemoryCategory = module.get<CategoryInterface>(CategoryInterface);

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

  it("should get an stock by its id", async () => {
    const stock = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create("Fruits");

    const stockItem = await inMemoryStockItem.insert({
      categoryId: category.id,
      itemName: "Apple",
      quantity: 10,
      stockId: stock.id,
      description: "A Big Apple",
    });

    const stockFiltered = await sut.getStockById(user.id, stock.id);

    expect(stockFiltered).toEqual({
      id: expect.any(String),
      stockName: "Apple Stock",
      stockOwner: user.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      active: true,
      totalItems: 1,
      stockItems: [
        expect.objectContaining({
          id: stockItem.id,
          itemName: "Apple",
          quantity: 10,
          stockId: stock.id,
          description: "A Big Apple",
          categoryId: category.id,
          categoryName: category.name,
          createdAt: stockItem.createdAt,
          updatedAt: stockItem.updatedAt,
        }),
      ],
    });
  });

  it("should not get an stock by its id without correctly provided parameters", async () => {
    await expect(() => {
      return sut.getStockById("", "any stock id");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.getStockById(user.id, "");
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));
  });

  it("should not get stock by its id if user doesn't exists", async () => {
    await expect(() => {
      return sut.getStockById("inexistent user id", "any stock id");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not get stock by its id if stock doesn't exists", async () => {
    await expect(() => {
      return sut.getStockById(user.id, "inexistent stock id");
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });

  it("should get stock by its id if stock doesn't belong to requested user id", async () => {
    const stock = await sut.createStock(user.id, {
      stockName: "Orange Stock",
    });

    const userTwo = await userService.registerUserService({
      email: "johndoe2@email.com",
      fullName: "John Doe2",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
    });

    await expect(() => {
      return sut.getStockById(userTwo.id, stock.id);
    }).rejects.toEqual(new ForbiddenException("Invalid permissions."));
  });
});
