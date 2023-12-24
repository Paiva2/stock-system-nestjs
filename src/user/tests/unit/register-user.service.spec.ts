import { BadRequestException, ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { compare } from "bcrypt";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";

describe("Register user service", () => {
  let sut: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserInterface, useClass: InMemoryUser },
        UserService,
      ],
    }).compile();

    sut = module.get<UserService>(UserService);
  });

  it("should init module correctly for tests", () => {
    expect(sut).toBeDefined();
  });

  it("should create a new user", async () => {
    const userCreation = await sut.registerUserService({
      email: "johndoe@email.com",
      fullName: "John Doe",
      password: "123456",
    });

    const matchPasswords = await compare("123456", userCreation.password);

    expect(matchPasswords).toBeTruthy();
    expect(userCreation).toEqual({
      id: expect.any(String),
      fullName: "John Doe",
      email: "johndoe@email.com",
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      role: "default",
    });
  });

  it("should not create a new user if e-mail already exists.", async () => {
    await sut.registerUserService({
      email: "johndoe@email.com",
      fullName: "John Doe",
      password: "123456",
    });

    await expect(() => {
      return sut.registerUserService({
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: "123456",
      });
    }).rejects.toEqual(new ConflictException("User is already registered."));
  });

  it("should not create a new user if request isn't correctly provided.", async () => {
    await expect(() => {
      return sut.registerUserService({
        email: "johndoe@email.com",
        fullName: "",
        password: "123456",
      });
    }).rejects.toEqual(new BadRequestException("Full name must be provided."));

    await expect(() => {
      return sut.registerUserService({
        email: "",
        fullName: "John Doe",
        password: "123456",
      });
    }).rejects.toEqual(new ConflictException("E-mail must be provided."));

    await expect(() => {
      return sut.registerUserService({
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: "",
      });
    }).rejects.toEqual(
      new ConflictException("Password must have at least 6 characters."),
    );
  });

  it("should not create a new user if password has less than 6 characters.", async () => {
    await expect(() => {
      return sut.registerUserService({
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: "12345",
      });
    }).rejects.toEqual(
      new ConflictException("Password must have at least 6 characters."),
    );
  });
});
