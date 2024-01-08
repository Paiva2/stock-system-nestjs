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

describe("Delete item service", () => {
  let user: IUser;
  let category: ICategory;

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

  it("should delete an item by id", async () => {
    const itemCreation = await sut.createItem(user.id, {
      categoryId: category.id,
      itemName: "Orange",
      description: "A Simple Orange",
    });

    const itemRemoved = await sut.deleteItem(user.id, itemCreation.id);

    expect(itemRemoved).toEqual(
      expect.objectContaining({
        id: itemCreation.id,
        userAttatchmentsId: user.userAttatchments[0].id,
        itemName: "Orange",
        description: "A Simple Orange",
        categoryId: category.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });
});
