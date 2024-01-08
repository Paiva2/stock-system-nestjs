import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Delete item controller", () => {
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

  test("[DELETE]/item/:itemId", async () => {
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

    const itemRemoval = await request(app.getHttpServer())
      .delete(`/item/${itemCreation.id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({});

    expect(itemRemoval.body.message).toEqual("Item successfully removed.");
    expect(itemRemoval.statusCode).toEqual(200);

    const getItem = await prisma.item.findFirst({
      where: {
        id: itemCreation.id,
      },
    });

    expect(getItem).toEqual(null);
  });
});
