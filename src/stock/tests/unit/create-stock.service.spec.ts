import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { StockInterface } from "../../stock.interface";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryStock } from "../../stock.in-memory";
import { StockService } from "../../stock.service";
import { UserService } from "../../../user/user.service";

describe("Create stock service", () => {
  let sut: StockService;
  let module: TestingModule;
  let userService: UserService;
  let user: IUser;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: StockInterface, useClass: InMemoryStock },
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

  it("should create a new stock", async () => {
    const newStock = await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    expect(newStock).toEqual({
      id: newStock.id,
      stockName: "Apple Stock",
      stockOwner: user.id,
      createdAt: newStock.createdAt,
      updatedAt: newStock.updatedAt,
      active: true,
    });
  });

  it("should not create a new stock without an user id", async () => {
    await expect(() => {
      return sut.createStock("", {
        stockName: "Apple Stock",
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not create a new stock if user doesn't exits", async () => {
    await expect(() => {
      return sut.createStock("Inexistent user id", {
        stockName: "Apple Stock",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not create a new stock if an stock with this name already exists on this account.", async () => {
    await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.createStock(user.id, {
        stockName: "Apple Stock",
      });
    }).rejects.toEqual(
      new ConflictException(
        "An stock this name is already created on this account.",
      ),
    );
  });
});
