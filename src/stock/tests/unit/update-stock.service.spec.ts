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
import { InMemoryCategory } from "src/category/category.in-memory";
import { CategoryInterface } from "src/category/category.interface";

describe("Update stock service", () => {
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
        { provide: CategoryInterface, useClass: InMemoryCategory },
        InMemoryStock,
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

  it("should update an stock by its id", async () => {
    const stock = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    const stockUpdated = await sut.updateStock(user.id, {
      id: stock.id,
      active: false,
      stockName: "Orange Stock",
    });

    expect(stockUpdated).toEqual(
      expect.objectContaining({
        id: stock.id,
        stockName: "Orange Stock",
        stockOwner: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        active: false,
      })
    );
  });

  it("should not update stock by its id without an user id provided", async () => {
    const stock = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.updateStock("", {
        id: stock.id,
        active: false,
        stockName: "Orange Stock",
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not update stock by its id without an stock id provided", async () => {
    await expect(() => {
      return sut.updateStock(user.id, {
        id: "",
        active: false,
        stockName: "Orange Stock",
      });
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));
  });

  it("should not update stock by its id if user doesn't exists", async () => {
    const stock = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.updateStock("Inexistent user id", {
        id: stock.id,
        active: false,
        stockName: "Orange Stock",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not update stock by its id if stock doesn't exists", async () => {
    await expect(() => {
      return sut.updateStock(user.id, {
        id: "Inexistent stock id",
        active: false,
        stockName: "Orange Stock",
      });
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });

  it("should not update stock by its id if stock doesn't belong to provided user id", async () => {
    const userTwo = await userService.registerUserService({
      email: "johndoe2@email.com",
      fullName: "John Doe 2",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Strokes",
    });

    const stock = await sut.createStock(userTwo.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.updateStock(user.id, {
        id: stock.id,
        active: false,
        stockName: "Orange Stock",
      });
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });
});
