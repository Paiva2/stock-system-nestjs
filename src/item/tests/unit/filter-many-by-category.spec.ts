import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ICategory, IUser } from "../../../@types/types";
import { CategoryInterface } from "../../../category/category.interface";
import { UserInterface } from "../../../user/user.interface";
import { ItemInterface } from "../../item.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { InMemoryCategory } from "../../../category/category.in-memory";
import { InMemoryItem } from "../../item.in-memory";
import { ItemService } from "../../item.service";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";

describe("Filter many by category", () => {
  let user: IUser;
  let category: ICategory;
  let otherCategory: ICategory;

  let inMemoryUser: UserInterface;
  let inMemoryCategory: CategoryInterface;

  let module: TestingModule;
  let sut: ItemService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: CategoryInterface, useClass: InMemoryCategory },
        { provide: ItemInterface, useClass: InMemoryItem },
        { provide: UserAttatchmentsInterface, useClass: InMemoryUserAttatchments },
        ItemService,
      ],
    }).compile();

    sut = module.get<ItemService>(ItemService);

    inMemoryUser = module.get<UserInterface>(UserInterface);
    inMemoryCategory = module.get<CategoryInterface>(CategoryInterface);

    user = await inMemoryUser.create({
      email: "johndoe@email.com",
      fullName: "John Doe",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
      role: "default",
    });

    category = await inMemoryCategory.create(user.userAttatchments[0].id, "Fruits");

    otherCategory = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Shirts"
    );
  });

  it("should filter items by category", async () => {
    const itemCreation = await sut.createItem(user.id, {
      categoryId: category.id,
      itemName: "Orange",
      description: "A Simple Orange",
    });

    await sut.createItem(user.id, {
      categoryId: otherCategory.id,
      itemName: "Blue Shirt",
      description: "A Simple Blue Shirt",
    });

    const listItems = await sut.filterByCategory(user.id, category.id, 1);

    expect(listItems).toEqual({
      page: 1,
      totalItems: 1,
      categoryName: "Fruits",
      items: [
        expect.objectContaining({
          id: itemCreation.id,
          userAttatchmentsId: user.userAttatchments[0].id,
          itemName: "Orange",
          description: "A Simple Orange",
          categoryId: category.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ],
    });
  });

  it("should not filter items by category without correctly provided parameters", async () => {
    await expect(() => {
      return sut.filterByCategory("", category.id, 1);
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not filter items by category if user doesn't exists", async () => {
    await expect(() => {
      return sut.filterByCategory("Inexistent user id.", category.id, 1);
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not filter items by category if user doesn't exists", async () => {
    await expect(() => {
      return sut.filterByCategory(user.id, "Inexistent category id", 1);
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });
});
