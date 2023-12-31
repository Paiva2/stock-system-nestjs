import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { StockInterface } from "../../stock.interface";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryStock } from "../../stock.in-memory";
import { StockService } from "../../stock.service";
import { UserService } from "../../../user/user.service";

describe("Get all account stocks service", () => {
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

  it("should list all account stocks", async () => {
    await sut.createStock(user.id, {
      stockName: "Apple Stock",
    });

    await sut.createStock(user.id, {
      stockName: "Orange Stock",
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
        },
        {
          id: expect.any(String),
          stockName: "Orange Stock",
          stockOwner: user.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          active: true,
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
