import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { StockModule } from "../../stock.module";
import { UserModule } from "../../../user/user.module";

describe("Get user profile controller", () => {
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

  it("[post]/stock", async () => {
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

    const stockCreation = await request(app.getHttpServer())
      .post("/stock")
      .send({ stockName: "Orange Stock" })
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(stockCreation.body.message).toEqual("Stock successfully created.");
    expect(stockCreation.statusCode).toEqual(201);

    const getStock = await prisma.stock.findFirst({
      where: {
        stockOwner: user.id,
      },
    });

    expect(getStock).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        stockName: "Orange Stock",
        stockOwner: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });
});