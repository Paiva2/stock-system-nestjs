import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Create item controller", () => {
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

  test("[POST]/item", async () => {
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

    const itemCreation = await request(app.getHttpServer())
      .post("/item")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        itemName: "Orange",
        description: "A Simple Orange",
        categoryId: category.id,
      });

    expect(itemCreation.body.message).toEqual("Item successfully created.");
    expect(itemCreation.statusCode).toEqual(201);

    const getItem = await prisma.item.findFirst({
      where: {
        categoryId: category.id,
        itemName: "Orange",
      },
    });

    expect(getItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userAttatchmentsId: userAttatchmens.id,
        itemName: "Orange",
        description: "A Simple Orange",
        categoryId: category.id,
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      })
    );
  });
});
