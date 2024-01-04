import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";
import { IStock } from "src/@types/types";

describe("Update stock controller", () => {
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

  test("[PATCH]/stock/:stockId", async () => {
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

    const updateStock = await request(app.getHttpServer())
      .patch(`/stock/${stockCreation.id}`)
      .send({
        active: false,
        stockName: "Apple Stock",
      })
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(updateStock.body.message).toEqual("Stock updated successfully.");
    expect(updateStock.statusCode).toEqual(200);

    const getStock: IStock = await prisma.stock.findFirst({
      where: {
        id: stockCreation.id,
      },
    });

    expect(getStock).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        stockName: "Apple Stock",
        stockOwner: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        active: false,
      })
    );
  });
});
