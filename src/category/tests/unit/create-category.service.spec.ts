import {
  BadRequestException,
  ConflictException,
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
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";

describe("Create category service", () => {
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

  it("should create a new category", async () => {
    const newCategory = await sut.create(user.id, "Fruits");

    expect(newCategory).toEqual({
      id: expect.any(String),
      name: "Fruits",
      createdAt: expect.any(Date),
      userAttatchmentsId: user.userAttatchments[0].id,
    });
  });

  it("should not create a new category without correctly provided parameters", async () => {
    await expect(() => {
      return sut.create("", "Fruits");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not create a new category if an category with this name already exists", async () => {
    await sut.create(user.id, "Fruits");

    await expect(() => {
      return sut.create(user.id, "Fruits");
    }).rejects.toEqual(
      new ConflictException("An category with this name already exists.")
    );
  });

  it("should not create a new category if user doesn't exists", async () => {
    await expect(() => {
      return sut.create("Inexistent user id", "Fruits");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
