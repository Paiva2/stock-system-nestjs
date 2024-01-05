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

describe("Get categories service", () => {
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

  it("should get all categories", async () => {
    await sut.create(user.id, "Fruits");
    await sut.create(user.id, "Shirts");

    const getCategories = await sut.getAllCategories(user.id, 1);

    expect(getCategories).toEqual({
      page: 1,
      totalCategories: 2,
      categories: [
        expect.objectContaining({
          id: expect.any(String),
          name: "Fruits",
          createdAt: expect.any(Date),
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: "Shirts",
          createdAt: expect.any(Date),
        }),
      ],
    });
  });

  it("should not list categories without correctly provided parameters", async () => {
    await expect(() => {
      return sut.getAllCategories("", 1);
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not list categories if user doesn't exists", async () => {
    await expect(() => {
      return sut.getAllCategories("Inexistent user id", 1);
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
