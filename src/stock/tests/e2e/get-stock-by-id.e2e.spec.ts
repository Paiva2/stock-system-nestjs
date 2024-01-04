import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { StockModule } from "../../stock.module";
import { UserModule } from "../../../user/user.module";
import { IStock } from "src/@types/types";
import { randomUUID } from "crypto";

describe("Get stock by id", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, StockModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  test("[GET]/stock/:stockId", async () => {
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

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const stockCreation: IStock = await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
      },
    });

    const category = await prisma.category.create({
      data: {
        name: "Fruits",
      },
    });

    const firstStockItem = await prisma.stockItem.create({
      data: {
        itemName: "Orange",
        quantity: 20,
        categoryId: category.id,
        description: "Big Orange",
        stockId: stockCreation.id,
      },
    });

    const secondStockItem = await prisma.stockItem.create({
      data: {
        itemName: "Little Orange",
        quantity: 5,
        categoryId: category.id,
        description: "Little Orange",
        stockId: stockCreation.id,
      },
    });

    const getStock = await request(app.getHttpServer())
      .get(`/stock/${stockCreation.id}`)
      .send()
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(getStock.statusCode).toEqual(200);
    expect(getStock.body).toEqual({
      id: stockCreation.id,
      stockName: "Orange Stock",
      stockOwner: user.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      totalItems: 2,
      totalItemsQuantity: 25,
      active: true,
      stockItems: [
        expect.objectContaining({
          id: firstStockItem.id,
          itemName: "Orange",
          quantity: 20,
          stockId: stockCreation.id,
          description: "Big Orange",
          categoryId: firstStockItem.categoryId,
        }),
        expect.objectContaining({
          id: secondStockItem.id,
          itemName: "Little Orange",
          quantity: 5,
          stockId: stockCreation.id,
          description: "Little Orange",
          categoryId: secondStockItem.categoryId,
        }),
      ],
    });
  });
});
