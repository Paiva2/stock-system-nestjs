import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Get item by id controller", () => {
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

  test("[GET]/item/:itemId", async () => {
    const hashPassword = await hash("123456", 8);

    const user = await prisma.user.create({
      data: {
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: hashPassword,
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
      },
    });

    const userAttatchmens = await prisma.userAttatchments.create({
      data: {
        userId: user.id,
      },
    });

    const category = await prisma.category.create({
      data: {
        name: "Fruits",
        userAttatchmentsId: userAttatchmens.id,
      },
    });

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const itemCreation = await prisma.item.create({
      data: {
        itemName: "Orange",
        description: "A simple Orange",
        categoryId: category.id,
        userAttatchmentsId: userAttatchmens.id,
      },
    });

    const getItem = await request(app.getHttpServer())
      .get(`/item/${itemCreation.id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({});

    expect(getItem.body).toEqual(
      expect.objectContaining({
        id: itemCreation.id,
        userAttatchmentsId: userAttatchmens.id,
        itemName: "Orange",
        description: "A simple Orange",
        categoryId: category.id,
        categoryName: "Fruits",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(getItem.statusCode).toEqual(200);
  });
});
