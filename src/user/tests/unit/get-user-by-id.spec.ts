import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";
import { IUser } from "../../../@types/types";

describe("Get user by id service", () => {
  let sut: UserService;
  let module: TestingModule;

  let user: IUser;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        UserService,
      ],
    }).compile();

    sut = module.get<UserService>(UserService);

    user = await sut.registerUserService({
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

  it("should get an user by its id", async () => {
    const getUser = await sut.getUserById(user.id);

    expect(getUser).toEqual({
      id: expect.any(String),
      fullName: "John Doe",
      email: "johndoe@email.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      role: "default",
    });
  });

  it("should not get an user by its id if user id are not provided", async () => {
    await expect(() => {
      return sut.getUserById("");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not get an user by its id if user doesn't exists", async () => {
    await expect(() => {
      return sut.getUserById("Inexistent user id");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
