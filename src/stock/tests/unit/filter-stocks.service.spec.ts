import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { StockInterface } from "../../stock.interface";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryStock } from "../../stock.in-memory";
import { StockService } from "../../stock.service";
import { UserService } from "../../../user/user.service";
import { StockItemInterface } from "src/stock_item/stock_item.interface";
import { InMemoryStockItem } from "src/stock_item/stock_item.in-memory";
import { CategoryInterface } from "src/category/category.interface";
import { InMemoryCategory } from "src/category/category.in-memory";

describe("Filter stocks service", () => {
  let sut: StockService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;

  let inMemoryStock: StockInterface;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: StockInterface, useClass: InMemoryStock },
        { provide: StockItemInterface, useClass: InMemoryStockItem },
        { provide: CategoryInterface, useClass: InMemoryCategory },
        StockService,
        UserService,
      ],
    }).compile();

    sut = module.get<StockService>(StockService);
    userService = module.get<UserService>(UserService);
    inMemoryStock = module.get<StockInterface>(StockInterface);

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

  it("should get all active stocks", async () => {
    const firstStock = await inMemoryStock.create(user.id, {
      stockName: "Fruits Stock",
    });

    const secondStock = await inMemoryStock.create(user.id, {
      stockName: "Shirts Stock",
    });

    const getActives = await sut.filterStocks(user.id, true, 1);

    expect(getActives).toEqual({
      page: 1,
      totalStocks: 2,
      active: true,
      stocks: expect.arrayContaining([
        expect.objectContaining({
          id: firstStock.id,
          stockName: "Fruits Stock",
          stockOwner: user.id,
          createdAt: firstStock.createdAt,
          updatedAt: firstStock.updatedAt,
          active: true,
        }),
        expect.objectContaining({
          id: secondStock.id,
          stockName: "Shirts Stock",
          stockOwner: user.id,
          createdAt: secondStock.createdAt,
          updatedAt: secondStock.updatedAt,
          active: true,
        }),
      ]),
    });
  });

  it("should get all inactive stocks", async () => {
    const firstStock = await inMemoryStock.create(user.id, {
      stockName: "Fruits Stock",
    });

    const secondStock = await inMemoryStock.create(user.id, {
      stockName: "Shirts Stock",
    });

    await inMemoryStock.update(user.id, {
      id: firstStock.id,
      active: false,
    });

    await inMemoryStock.update(user.id, {
      id: secondStock.id,
      active: false,
    });

    const getInactives = await sut.filterStocks(user.id, false, 1);

    expect(getInactives).toEqual({
      page: 1,
      totalStocks: 2,
      active: false,
      stocks: expect.arrayContaining([
        expect.objectContaining({
          id: firstStock.id,
          stockName: "Fruits Stock",
          stockOwner: user.id,
          createdAt: firstStock.createdAt,
          updatedAt: firstStock.updatedAt,
          active: false,
        }),
        expect.objectContaining({
          id: secondStock.id,
          stockName: "Shirts Stock",
          stockOwner: user.id,
          createdAt: secondStock.createdAt,
          updatedAt: secondStock.updatedAt,
          active: false,
        }),
      ]),
    });
  });

  it("should not get all inactive stocks without correctly provided params", async () => {
    await expect(() => {
      return sut.filterStocks("", true, 1);
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.filterStocks(user.id, undefined, 1);
    }).rejects.toEqual(new BadRequestException("Active must be true or false."));
  });

  it("should not get all inactive stocks without an valid user", async () => {
    await expect(() => {
      return sut.filterStocks("Inexistent user id", true, 1);
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
