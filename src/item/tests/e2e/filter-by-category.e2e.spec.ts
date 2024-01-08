import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Filter items by category", () => {
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

  test("[GET]/items/filter?category=categoryId?page=1", async () => {
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

    const listItemsByCategory = await request(app.getHttpServer())
      .get(`/items/filter?category=${category.id}&page=1`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({});

    expect(listItemsByCategory.body).toEqual({
      categoryName: "Fruits",
      page: 1,
      totalItems: 1,
      items: [
        expect.objectContaining({
          id: itemCreation.id,
          userAttatchmentsId: userAttatchmens.id,
          itemName: "Orange",
          description: "A simple Orange",
          categoryId: category.id,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        }),
      ],
    });
    expect(listItemsByCategory.statusCode).toEqual(200);
  });
});
