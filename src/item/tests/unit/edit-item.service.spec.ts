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

describe("Edit item service", () => {
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
  });

  it("should edit an item by id", async () => {
    otherCategory = await inMemoryCategory.create(
      user.userAttatchments[0].id,
      "Other Fruits"
    );

    const itemCreation = await sut.createItem(user.id, {
      categoryId: category.id,
      itemName: "Orange",
      description: "A Simple Orange",
    });

    const itemUpdated = await sut.editItem(user.id, {
      id: itemCreation.id,
      itemName: "Edited Orange",
      description: "Edited Orange Description",
      categoryId: otherCategory.id,
    });

    expect(itemUpdated).toEqual(
      expect.objectContaining({
        id: itemCreation.id,
        userAttatchmentsId: user.userAttatchments[0].id,
        itemName: "Edited Orange",
        description: "Edited Orange Description",
        categoryId: otherCategory.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });

  it("should not edit an item by id without correctly provided parameters", async () => {
    await expect(() => {
      return sut.editItem(null, {
        id: "Any item id",
        categoryId: category.id,
        itemName: "Orange",
        description: "A Simple Orange",
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.editItem(user.id, {
        id: null,
        categoryId: category.id,
        itemName: "Orange",
        description: "A Simple Orange",
      });
    }).rejects.toEqual(new BadRequestException("Invalid item id."));
  });

  it("should not edit an item by id if user doesn't exists", async () => {
    await expect(() => {
      return sut.editItem("Inexistent user", {
        id: "Any item id",
        categoryId: category.id,
        itemName: "Orange",
        description: "A Simple Orange",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not edit an item by id if category doesn't exists", async () => {
    await expect(() => {
      return sut.editItem(user.id, {
        id: "Any item id",
        categoryId: "Inexistent category",
        itemName: "Orange",
        description: "A Simple Orange",
      });
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });

  it("should not edit an item by id if item doesn't exists", async () => {
    await expect(() => {
      return sut.editItem(user.id, {
        id: "Inexistent item",
        categoryId: category.id,
        itemName: "Orange",
        description: "A Simple Orange",
      });
    }).rejects.toEqual(new NotFoundException("Item not found."));
  });
});
