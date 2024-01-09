import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Filter stock item by id controller", () => {
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

  test("[GET]/stock-item/:stockId/:stockItemId", async () => {
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

    const stockCreation = await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
      },
    });

    const categoryCreation = await prisma.category.create({
      data: {
        name: "Fruit",
        userAttatchmentsId: userAttatchments.id,
      },
    });

    const insertStockItem = await prisma.stockItem.create({
      data: {
        itemName: "Big Orange",
        quantity: 2,
        stockId: stockCreation.id,
        description: "An big orange!",
        categoryId: categoryCreation.id,
      },
    });

    const filterItem = await request(app.getHttpServer())
      .get(`/stock-item/${stockCreation.id}/${insertStockItem.id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({});

    expect(filterItem.body).toEqual(
      expect.objectContaining({
        id: insertStockItem.id,
        itemName: "Big Orange",
        description: "An big orange!",
        quantity: 2,
        stockId: stockCreation.id,
        categoryId: categoryCreation.id,
      })
    );
    expect(filterItem.statusCode).toEqual(200);
  });
});
