import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Get all categories controller", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  it("[GET]/categories", async () => {
    const hashPassword = await hash("123456", 8);

    const user = await prisma.user.create({
      data: {
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: hashPassword,
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
        role: "default",
      },
    });

    const userAttatchments = await prisma.userAttatchments.create({
      data: {
        userId: user.id,
      },
    });

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    await prisma.category.create({
      data: {
        name: "Fruits",
        userAttatchmentsId: userAttatchments.id,
      },
    });

    await prisma.category.create({
      data: {
        name: "Shirts",
        userAttatchmentsId: userAttatchments.id,
      },
    });

    const getCategories = await request(app.getHttpServer())
      .get("/categories?page=1")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send();

    expect(getCategories.statusCode).toEqual(200);

    expect(getCategories.body).toEqual({
      page: 1,
      totalCategories: 2,
      categories: [
        expect.objectContaining({
          id: expect.any(String),
          name: "Fruits",
          createdAt: expect.any(String),
          userAttatchmentsId: userAttatchments.id,
        }),

        expect.objectContaining({
          id: expect.any(String),
          name: "Shirts",
          createdAt: expect.any(String),
          userAttatchmentsId: userAttatchments.id,
        }),
      ],
    });
  });
});
