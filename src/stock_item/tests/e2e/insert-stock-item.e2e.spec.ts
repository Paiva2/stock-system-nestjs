import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";
import { ICategory, IStock, IUser, IUserAttatchments } from "../../../@types/types";

describe("Insert stock item controller", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let user: IUser;
  let userAttatchments: IUserAttatchments;
  let stockCreation: IStock;
  let categoryCreation: ICategory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    const hashPassword = await hash("123456", 8);

    user = await prisma.user.create({
      data: {
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: hashPassword,
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
      },
    });

    userAttatchments = await prisma.userAttatchments.create({
      data: {
        userId: user.id,
      },
    });

    stockCreation = await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
      },
    });

    categoryCreation = await prisma.category.create({
      data: {
        name: "Fruit",
        userAttatchmentsId: userAttatchments.id,
      },
    });

    await app.init();
  });

  test("[POST]/stock-item/insert (NO EXISTENT ITEM)", async () => {
    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const insertStockItem = await request(app.getHttpServer())
      .post("/stock-item/insert")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        stockId: stockCreation.id,
        stockItem: {
          itemName: "Big Orange",
          quantity: 2,
          stockId: stockCreation.id,
          description: "An big orange!",
          categoryId: categoryCreation.id,
        },
      });

    expect(insertStockItem.body.message).toEqual("Stock Item successfully added.");
    expect(insertStockItem.statusCode).toEqual(201);

    const getStockItem = await prisma.stockItem.findFirst({
      where: {
        stockId: stockCreation.id,
      },
    });

    expect(getStockItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        itemName: "Big Orange",
        quantity: 2,
        stockId: stockCreation.id,
        description: "An big orange!",
        categoryId: categoryCreation.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });

  test("[POST]/stock-item/insert (EXISTENT ITEM)", async () => {
    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const existentItem = await prisma.item.create({
      data: {
        itemName: "Apple",
        categoryId: categoryCreation.id,
        description: "A simple Apple",
        userAttatchmentsId: userAttatchments.id,
      },
    });

    const insertStockItem = await request(app.getHttpServer())
      .post("/stock-item/insert")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        stockId: stockCreation.id,
        stockItem: {
          itemId: existentItem.id,
          itemName: "Big Orange",
          quantity: 2,
          stockId: stockCreation.id,
          description: "An big orange!",
          categoryId: categoryCreation.id,
        },
      });

    expect(insertStockItem.body.message).toEqual("Stock Item successfully added.");
    expect(insertStockItem.statusCode).toEqual(201);

    const getStockItem = await prisma.stockItem.findFirst({
      where: {
        stockId: stockCreation.id,
        AND: {
          itemName: "Apple",
        },
      },
    });

    expect(getStockItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        itemName: "Apple",
        quantity: 2,
        stockId: stockCreation.id,
        description: "A simple Apple",
        categoryId: categoryCreation.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });
});
