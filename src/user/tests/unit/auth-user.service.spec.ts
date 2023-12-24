import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserInterface } from "../../user.interface";
import { UserService } from "../../user.service";
import { InMemoryUser } from "../../user.in-memory";

describe("Auth user service", () => {
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

    await sut.registerUserService({
      email: "johndoe@email.com",
      fullName: "John Doe",
      password: "123456",
    });
  });

  it("should init module correctly for tests", () => {
    expect(sut).toBeDefined();
  });

  it("should auth an provided user", async () => {
    const authUser = await sut.authUserService({
      email: "johndoe@email.com",
      password: "123456",
    });

    expect(authUser).toEqual({
      id: expect.any(String),
      fullName: "John Doe",
      email: "johndoe@email.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      role: "default",
    });
  });

  it("should not auth user if request isn't correctly provided", async () => {
    await expect(() => {
      return sut.authUserService({
        email: "",
        password: "123456",
      });
    }).rejects.toEqual(new BadRequestException("Invalid e-mail provided."));

    await expect(() => {
      return sut.authUserService({
        email: "johndoe@email.com",
        password: "",
      });
    }).rejects.toEqual(new BadRequestException("Invalid password provided."));

    await expect(() => {
      return sut.authUserService({
        email: "johndoe@email.com",
        password: "12345",
      });
    }).rejects.toEqual(
      new BadRequestException("Password must have at least 6 characters."),
    );
  });

  it("should not auth user if user isnt't registered", async () => {
    await expect(() => {
      return sut.authUserService({
        email: "noregistered@email.com",
        password: "123456",
      });
    }).rejects.toEqual(new NotFoundException("User not found."));
  });

  it("should not auth user if credentias dont't match", async () => {
    await expect(() => {
      return sut.authUserService({
        email: "johndoe@email.com",
        password: "wrong pass",
      });
    }).rejects.toEqual(new NotFoundException("Invalid credentials."));
  });
});
