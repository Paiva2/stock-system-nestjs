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

describe("Delete account stock service", () => {
  let sut: StockService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: StockInterface, useClass: InMemoryStock },
        { provide: StockItemInterface, useClass: InMemoryStockItem },
        StockService,
        UserService,
      ],
    }).compile();

    sut = module.get<StockService>(StockService);
    userService = module.get<UserService>(UserService);

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

  it("should delete an account stock by id parameter", async () => {
    const stockToDelete = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    await sut.createStock(user.id, {
      stockName: "Orange Stock",
    });

    const stockDeleted = await sut.deleteAccountStock(user.id, stockToDelete.id);

    const stocksList = await sut.getAllAccountStocks(user.id, 1);

    expect(stockDeleted).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        stockName: "Apple Stock",
        stockOwner: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        active: true,
        totalItems: 0,
        totalItemsQuantity: 0,
      })
    );
    expect(stocksList).toEqual({
      page: 1,
      totalStocks: 1,
      stocks: expect.arrayContaining([
        {
          id: expect.any(String),
          stockName: "Orange Stock",
          stockOwner: user.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          active: true,
          totalItems: 0,
          totalItemsQuantity: 0,
        },
      ]),
    });
  });

  it("should not list all account stocks without correctly provided parameters", async () => {
    await expect(() => {
      return sut.deleteAccountStock("", "any stock id");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.deleteAccountStock(user.id, "");
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));
  });

  it("should not list all account stocks if user doesn't exists", async () => {
    await expect(() => {
      return sut.deleteAccountStock("Inexistent user id.", "any stock id");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not list all account stocks if stock doesn't exists", async () => {
    await expect(() => {
      return sut.deleteAccountStock(user.id, "inexistent stock id");
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });
});
