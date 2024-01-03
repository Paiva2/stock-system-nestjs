import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Remove stock item controller", () => {
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

  test("[DELETE]/stock-item/remove/:stockItemId", async () => {
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

    const stockCreation = await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
      },
    });

    const categoryCreation = await prisma.category.create({
      data: {
        name: "Fruit",
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

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const removeStockItemFromStock = await request(app.getHttpServer())
      .delete(`/stock-item/remove/${insertStockItem.id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        stockId: stockCreation.id,
      });

    expect(removeStockItemFromStock.body.message).toEqual(
      "Stock Item successfully removed."
    );
    expect(removeStockItemFromStock.statusCode).toEqual(200);

    const checkIfStockItemIsRemoved = await prisma.stockItem.findFirst({
      where: {
        id: insertStockItem.id,
      },
    });

    expect(checkIfStockItemIsRemoved).toEqual(null);
  });
});
