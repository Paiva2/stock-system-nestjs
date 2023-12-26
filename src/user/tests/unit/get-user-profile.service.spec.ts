import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";
import { IUser } from "../../../@types/types";

describe("Get user profile service", () => {
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

  it("should get an user profile", async () => {
    const getProfile = await sut.getUserProfile(user.id);

    expect(getProfile).toEqual({
      id: expect.any(String),
      fullName: "John Doe",
      email: "johndoe@email.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      role: "default",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
    });
  });

  it("should not get an user profile if request are not provided correctly", async () => {
    await expect(() => {
      return sut.getUserProfile("");
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not get an user profile if user aren't registered", async () => {
    await expect(() => {
      return sut.getUserProfile("non registered user id");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
