import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { UserModule } from "../../user.module";
import { PrismaService } from "../../../infra/database/prisma.service";

describe("Get user profile controller", () => {
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

  it("[GET]/profile", async () => {
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

    const jwtToken = signIn.body.access_token;

    const profile = await request(app.getHttpServer())
      .get("/profile")
      .send()
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(profile.body).toEqual({
      id: expect.any(String),
      email: "johndoe@email.com",
      fullName: "John Doe",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      role: "default",
      secretQuestion: "Favourite Band",
      secretAnswer: "The Beatles",
    });
  });
});
