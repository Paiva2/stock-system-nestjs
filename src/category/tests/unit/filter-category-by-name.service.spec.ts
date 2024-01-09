import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IUser } from "../../../@types/types";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { UserService } from "../../../user/user.service";
import { CategoryService } from "../../category.service";
import { CategoryInterface } from "../../category.interface";
import { InMemoryCategory } from "../../category.in-memory";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";

describe("Filter category by name service", () => {
  let sut: CategoryService;
  let module: TestingModule;
  let inMemoryUser: UserInterface;
  let user: IUser;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: CategoryInterface, useClass: InMemoryCategory },
        { provide: UserAttatchmentsInterface, useClass: InMemoryUserAttatchments },
        CategoryService,
        UserService,
      ],
    }).compile();

    sut = module.get<CategoryService>(CategoryService);
    inMemoryUser = module.get<UserInterface>(UserInterface);

    user = await inMemoryUser.create({
      email: "johndoe@email.com",
      fullName: "John Doe",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
      role: "admin",
    });
  });

  it("should init module correctly for tests", () => {
    expect(sut).toBeDefined();
  });

  it("should filter an category by name", async () => {
    const newCategory = await sut.create(user.id, "Fruits");

    const categoryDeleted = await sut.filterCategoryByName(user.id, "Fruits");

    expect(categoryDeleted).toEqual({
      id: newCategory.id,
      name: "Fruits",
      createdAt: newCategory.createdAt,
      userAttatchmentsId: user.userAttatchments[0].id,
    });
  });

  it("should not filter an category by id without correctly provided parameters", async () => {
    const newCategory = await sut.create(user.id, "Fruits");

    await expect(() => {
      return sut.filterCategoryByName("", newCategory.id);
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.filterCategoryByName(user.id, "");
    }).rejects.toEqual(new BadRequestException("Invalid category name."));
  });

  it("should not filter an category by id if user doesn't exists", async () => {
    await expect(() => {
      return sut.filterCategoryByName("Inexistent user", "Any category id");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not filter an category by id if user category't exists", async () => {
    await expect(() => {
      return sut.filterCategoryByName(user.id, "Inexistent caregory");
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });
});
