import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { UserModule } from "../../user.module";
import { PrismaService } from "../../../infra/database/prisma.service";

describe("Forgot user password controller", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  it("[PATCH]/forgot-password", async () => {
    const hashPassword = await hash("123456", 8);

    await prisma.user.create({
      data: {
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: hashPassword,
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
      },
    });

    const updatePassword = await request(app.getHttpServer())
      .patch("/forgot-password")
      .send({
        email: "johndoe@email.com",
        newPassword: "newpass",
      });

    expect(updatePassword.statusCode).toBe(200);
    expect(updatePassword.body.message).toEqual(
      "Password updated successfully.",
    );
  });
});
