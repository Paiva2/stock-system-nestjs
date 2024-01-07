import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ICategory, IUser } from "../../../@types/types";
import { UserInterface } from "../../../user/user.interface";
import { InMemoryUser } from "../../../user/user.in-memory";
import { UserService } from "../../../user/user.service";
import { CategoryService } from "../../category.service";
import { CategoryInterface } from "../../category.interface";
import { InMemoryCategory } from "../../category.in-memory";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";

describe("Update category service", () => {
  let sut: CategoryService;
  let module: TestingModule;
  let inMemoryUser: UserInterface;
  let user: IUser;
  let category: ICategory;

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

    category = await sut.create(user.id, "Fruits");
  });

  it("should init module correctly for tests", () => {
    expect(sut).toBeDefined();
  });

  it("should update an category informations", async () => {
    const updateCategory = await sut.updateCategory(user.id, {
      id: category.id,
      name: "Shirts",
    });

    expect(updateCategory).toEqual({
      id: category.id,
      name: "Shirts",
      createdAt: category.createdAt,
      userAttatchmentsId: user.userAttatchments[0].id,
    });
  });

  it("should not update an category informations without provided parameters", async () => {
    await expect(() => {
      return sut.updateCategory("", {
        id: "Any category id",
        name: "Shirts",
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));

    await expect(() => {
      return sut.updateCategory(user.id, {
        id: "",
        name: "Shirts",
      });
    }).rejects.toEqual(new BadRequestException("Invalid category id."));
  });

  it("should not update an category informations if user doesn't exists", async () => {
    await expect(() => {
      return sut.updateCategory("Inexistent user id.", {
        id: category.id,
        name: "Shirts",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not update an category informations if an category with provided name already exists", async () => {
    await sut.create(user.id, "Shirts");

    await expect(() => {
      return sut.updateCategory(user.id, {
        id: category.id,
        name: "Shirts",
      });
    }).rejects.toEqual(
      new ConflictException("An category with this name already exists.")
    );
  });

  it("should not update an category informations if category doesn't exists", async () => {
    await expect(() => {
      return sut.updateCategory(user.id, {
        id: "Inexistent category id",
        name: "Shirts",
      });
    }).rejects.toEqual(new NotFoundException("Category not found."));
  });
});
