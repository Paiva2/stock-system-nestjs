import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserModule } from "../../user.module";
import { PrismaService } from "../../../infra/database/prisma.service";
import { hash } from "bcrypt";

describe("Register user controller", () => {
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

  it("[POST]/sign-in", async () => {
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

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    expect(signIn.statusCode).toBe(200);
    expect(signIn.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
