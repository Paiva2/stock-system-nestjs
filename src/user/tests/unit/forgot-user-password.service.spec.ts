import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { IUser } from "../../../@types/types";
import { compare } from "bcrypt";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";

describe("Forgot user password service", () => {
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
    });
  });

  it("should init module correctly for tests", () => {
    expect(sut).toBeDefined();
  });

  it("should update an user password", async () => {
    const updateUser = await sut.forgotUserPassword(
      "johndoe@email.com",
      "changepass",
    );

    const matchPasswords = await compare("changepass", updateUser.password);

    expect(matchPasswords).toBeTruthy();
    expect(updateUser).toEqual({
      id: expect.any(String),
      password: expect.any(String),
      fullName: "John Doe",
      email: "johndoe@email.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      role: "default",
    });
  });

  it("should not update an user password if requests not provided correctly", async () => {
    await expect(() => {
      return sut.forgotUserPassword("", "changepass");
    }).rejects.toEqual(new BadRequestException("Invalid user email."));

    await expect(() => {
      return sut.forgotUserPassword(user.id, "");
    }).rejects.toEqual(new BadRequestException("Invalid new password."));

    await expect(() => {
      return sut.forgotUserPassword(user.id, "12345");
    }).rejects.toEqual(
      new BadRequestException("New password must have at least 6 characters."),
    );
  });

  it("should not update an user password if user doesn't exists", async () => {
    await expect(() => {
      return sut.forgotUserPassword("inexistent user email", "changepass");
    }).rejects.toEqual(new NotFoundException("User not found."));
  });
});
