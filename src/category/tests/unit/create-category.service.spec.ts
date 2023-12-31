import {
  BadGatewayException,
  ConflictException,
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

describe("Create stock service", () => {
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

  it("should create a new category", async () => {
    const newCategory = await sut.create(user.id, "Fruits");

    expect(newCategory).toEqual({
      id: expect.any(String),
      name: "Fruits",
      createdAt: expect.any(Date),
    });
  });

  it("should not create a new category without correctly provided parameters", async () => {
    await expect(() => {
      return sut.create("", "Fruits");
    }).rejects.toEqual(new BadGatewayException("Invalid user id."));
  });

  it("should not create a new category if an category with this name already exists", async () => {
    await sut.create(user.id, "Fruits");

    await expect(() => {
      return sut.create(user.id, "Fruits");
    }).rejects.toEqual(
      new ConflictException("An category with this name already exists."),
    );
  });

  it("should not create a new category if user doesn't exists", async () => {
    await expect(() => {
      return sut.create("Inexistent user id", "Fruits");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not create a new category if user isn't an admin", async () => {
    const nonAdminUser = await inMemoryUser.create({
      email: "johndoe2@email.com",
      fullName: "John Doe 2",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
      role: "default",
    });

    await expect(() => {
      return sut.create(nonAdminUser.id, "Fruits");
    }).rejects.toEqual(new ForbiddenException("Invalid permissions."));
  });
});
