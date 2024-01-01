import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IUser } from "../../../@types/types";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { UserService } from "../../../user/user.service";
import { CategoryService } from "../../category.service";
import { CategoryInterface } from "../../category.interface";
import { InMemoryCategory } from "../../category.in-memory";

describe("Delete category service", () => {
  let sut: CategoryService;
  let module: TestingModule;
  let inMemoryUser: UserInterface;
  let user: IUser;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: CategoryInterface, useClass: InMemoryCategory },
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

  it("should delete an category", async () => {
    const newCategory = await sut.create(user.id, "Fruits");

    const categoryDeleted = await sut.deleteCategory(user.id, newCategory.id);

    expect(categoryDeleted).toEqual({
      id: newCategory.id,
      name: "Fruits",
      createdAt: newCategory.createdAt,
    });
  });

  it("should not delete category without correctly provided parameters", async () => {
    await expect(() => {
      return sut.deleteCategory("", "Any category id");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.deleteCategory(user.id, "");
    }).rejects.toEqual(new BadRequestException("Invalid category id."));
  });

  it("should not delete category if user doesn't exists", async () => {
    await expect(() => {
      return sut.deleteCategory("Inexistent user id", "Any category id");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not delete category if category doesn't exists", async () => {
    await expect(() => {
      return sut.deleteCategory(user.id, "Inexistent category id");
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });

  it("should not delete category if user isn't an admin", async () => {
    const nonAdminUser = await inMemoryUser.create({
      email: "johndoe2@email.com",
      fullName: "John Doe 2",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
      role: "default",
    });

    await expect(() => {
      return sut.deleteCategory(nonAdminUser.id, "Any category id");
    }).rejects.toEqual(new ForbiddenException("Invalid permissions."));
  });
});