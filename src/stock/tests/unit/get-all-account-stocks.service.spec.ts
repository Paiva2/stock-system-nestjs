import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { StockService } from "../../stock.service";
import { UserService } from "../../../user/user.service";
import { StockItemInterface } from "../../../stock_item/stock_item.interface";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryStockItem } from "../../../stock_item/stock_item.in-memory";
import { StockInterface } from "../../stock.interface";
import { InMemoryStock } from "../../stock.in-memory";
import { CategoryInterface } from "../../../category/category.interface";
import { InMemoryCategory } from "../../../category/category.in-memory";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";
import { randomUUID } from "crypto";

describe("Get all account stocks service", () => {
  let sut: StockService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;
  let inMemoryStockItem: StockItemInterface;

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

  it("should list all account stocks", async () => {
    const appleStock = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    const orangeStock = await sut.createStock(user.id, {
      stockName: "Orange Stock",
    });

    await inMemoryStockItem.insert({
      categoryId: randomUUID(),
      itemName: "Green Apple",
      quantity: 2,
      stockId: appleStock.id,
      description: "A Big Green Apple",
    });

    await inMemoryStockItem.insert({
      categoryId: randomUUID(),
      itemName: "Red Apple",
      quantity: 5,
      stockId: appleStock.id,
      description: "A Big Red Apple",
    });

    await inMemoryStockItem.insert({
      categoryId: randomUUID(),
      itemName: "Orange",
      quantity: 2,
      stockId: orangeStock.id,
      description: "A Big Orange",
    });

    await inMemoryStockItem.insert({
      categoryId: randomUUID(),
      itemName: "Tiny Orange",
      quantity: 8,
      stockId: orangeStock.id,
      description: "A Tiny Orange",
    });

    const stocksList = await sut.getAllAccountStocks(user.id, 1);

    expect(stocksList).toEqual({
      page: 1,
      totalStocks: 2,
      stocks: expect.arrayContaining([
        {
          id: expect.any(String),
          stockName: "Apple Stock",
          stockOwner: user.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          active: true,
          totalItems: 2,
        },
        {
          id: expect.any(String),
          stockName: "Orange Stock",
          stockOwner: user.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          active: true,
          totalItems: 2,
        },
      ]),
    });
  });

  it("should not list all account stocks without an user id", async () => {
    await expect(() => {
      return sut.getAllAccountStocks("", 1);
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not list all account stocks if user doesn't exists", async () => {
    await expect(() => {
      return sut.getAllAccountStocks("Inexistent user id.", 1);
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
