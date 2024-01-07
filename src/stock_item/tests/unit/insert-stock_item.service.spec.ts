import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
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

describe("Insert stock item service", () => {
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

  it("should insert a new stock item on stock [MANUALLY]", async () => {
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

    expect(insertItem).toEqual({
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

  it("should insert a new stock item on stock [EXISTENT ITEM]", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    const existentItem = await inMemoryItem.create(user.userAttatchments[0].id, {
      categoryId: category.id,
      itemName: "Orange",
      description: "A simple orange",
      categoryName: category.name,
    });

    const insertItem = await sut.insertStockItem(user.id, newStock.id, {
      itemId: existentItem.id, // IT SHOULD IGNORE ALL INFOS BELOW AND FILL WITH EXISTENT ITEM INFOS
      categoryId: category.id,
      itemName: "Green Apple",
      quantity: 1,
      stockId: newStock.id,
      description: "Simple green apple",
    });

    expect(insertItem).toEqual({
      id: expect.any(String),
      itemName: "Orange",
      quantity: 1,
      stockId: newStock.id,
      description: "A simple orange",
      categoryId: category.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should insert a new stock item on stock if existent item provided id doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    await expect(() => {
      return sut.insertStockItem(user.id, newStock.id, {
        itemId: "INVALID ID",
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(new NotFoundException("Item not found."));
  });

  it("should not insert a new stock item on stock without correctly provided parameters", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    await expect(() => {
      return sut.insertStockItem("", newStock.id, {
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.insertStockItem(user.id, "", {
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(new BadRequestException("Invalid stock id."));

    await expect(() => {
      return sut.insertStockItem(user.id, newStock.id, {
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: "",
        description: "Simple green apple",
      });
    }).rejects.toEqual(
      new BadRequestException("You must provide an valid stock id and category id.")
    );

    await expect(() => {
      return sut.insertStockItem(user.id, newStock.id, {
        categoryId: "",
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(
      new BadRequestException("You must provide an valid stock id and category id.")
    );
  });

  it("should not insert a new stock item on stock if user doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    await expect(() => {
      return sut.insertStockItem("Inexistent user id", newStock.id, {
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not insert a new stock item on stock if stock doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    await expect(() => {
      return sut.insertStockItem(user.id, "Inexistent stock id", {
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(new NotFoundException("Stock not found."));
  });

  it("should not insert a new stock item on stock if user doesn't own this stock", async () => {
    const otherUser = await userService.registerUserService({
      email: "johndoe2@email.com",
      fullName: "John Doe 2",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
    });

    const newStock = await inMemoryStock.create(otherUser.id, {
      stockName: "Apple Stock",
    });

    const category = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Apples"
    );

    await expect(() => {
      return sut.insertStockItem(user.id, newStock.id, {
        categoryId: category.id,
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(
      new ForbiddenException("You must be the stock owner to insert item on it.")
    );
  });

  it("should not insert a new stock item on stock if category doesn't exists", async () => {
    const newStock = await inMemoryStock.create(user.id, {
      stockName: "Apple Stock",
    });

    await expect(() => {
      return sut.insertStockItem(user.id, newStock.id, {
        categoryId: "Inexistent category id",
        itemName: "Green Apple",
        quantity: 1,
        stockId: newStock.id,
        description: "Simple green apple",
      });
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });
});
