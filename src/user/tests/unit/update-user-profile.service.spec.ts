import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";
import { IUser } from "../../../@types/types";
import { compare } from "bcrypt";
import { UserAttatchmentsInterface } from "../../../user-attatchments/user-attatchments.interface";
import { InMemoryUserAttatchments } from "../../../user-attatchments/user-attatchments.in-memory";

describe("Update user profile service", () => {
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

  it("should update an user profile informations", async () => {
    const updatedUser = await sut.updateUserProfile(user.id, {
      fullName: "Change my fullName",
      password: "My new password",
      email: "johndoechange@email.com",
    });

    const matchNewPassword = await compare("My new password", updatedUser.password);

    expect(matchNewPassword).toBeTruthy();
    expect(updatedUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        fullName: "Change my fullName",
        email: "johndoechange@email.com",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        role: "default",
        password: expect.any(String),
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
      })
    );
  });

  it("should not update an user profile without an user id provided", async () => {
    await expect(() => {
      return sut.updateUserProfile("", {
        fullName: "Change my fullName",
        password: "My new password",
        email: "johndoechange@email.com",
      });
    }).rejects.toEqual(new BadRequestException("Invalid user id."));
  });

  it("should not update an user profile if user doesn't exists", async () => {
    await expect(() => {
      return sut.updateUserProfile("inexistent user id", {
        fullName: "Change my fullName",
        password: "My new password",
        email: "johndoechange@email.com",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not update an user profile if e-mail already exists", async () => {
    await sut.registerUserService({
      email: "alreadyexistsemail@email.com",
      fullName: "John Doe",
      password: "123456",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
    });

    await expect(() => {
      return sut.updateUserProfile(user.id, {
        fullName: "Change my fullName",
        password: "My new password",
        email: "alreadyexistsemail@email.com",
      });
    }).rejects.toEqual(new NotFoundException("E-mail already exists."));
  });
});
