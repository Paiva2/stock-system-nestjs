import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { compare } from "bcrypt";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";

describe("Forgot user password service", () => {
  let sut: UserService;
  let module: TestingModule;

  let user: IUser;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        { provide: UserAttatchmentsInterface, useClass: InMemoryUserAttatchments },
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

  it("should update an user password", async () => {
    const updateUser = await sut.forgotUserPassword(
      "johndoe@email.com",
      "changepass",
      "The Beatles"
    );

    const matchPasswords = await compare("changepass", updateUser.password);

    expect(matchPasswords).toBeTruthy();
    expect(updateUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        password: expect.any(String),
        fullName: "John Doe",
        email: "johndoe@email.com",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        role: "default",
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
      })
    );
  });

  it("should not update an user password if requests not provided correctly", async () => {
    await expect(() => {
      return sut.forgotUserPassword("", "changepass", "The Beatles");
    }).rejects.toEqual(new BadRequestException("Invalid user email."));

    await expect(() => {
      return sut.forgotUserPassword(user.id, "", "The Beatles");
    }).rejects.toEqual(new BadRequestException("Invalid new password."));

    await expect(() => {
      return sut.forgotUserPassword(user.id, "12345", "The Beatles");
    }).rejects.toEqual(
      new BadRequestException("New password must have at least 6 characters.")
    );
  });

  it("should not update an user password if user doesn't exists", async () => {
    await expect(() => {
      return sut.forgotUserPassword(
        "inexistent user email",
        "changepass",
        "The Beatles"
      );
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not update an user password if secret answer doesn't match", async () => {
    await expect(() => {
      return sut.forgotUserPassword(
        "johndoe@email.com",
        "changepass",
        "The Rolling Stones"
      );
    }).rejects.toEqual(new NotFoundException("Secret answer doesn't match."));
  });
});
