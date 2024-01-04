import { Test, TestingModule } from "@nestjs/testing";
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
    });

    expect(editItem).toEqual({
      id: insertItem.id,
      itemName: "Red Apple",
      quantity: 20,
      stockId: newStock.id,
      description: "Change description",
      categoryId: category.id,
      createdAt: insertItem.createdAt,
      updatedAt: insertItem.updatedAt,
    });
  });
});
