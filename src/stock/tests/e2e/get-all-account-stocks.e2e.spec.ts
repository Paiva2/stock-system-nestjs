import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { StockModule } from "../../stock.module";
import { UserModule } from "../../../user/user.module";

describe("Get all account stocks", () => {
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

  it("[GET]/stocks", async () => {
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

    await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
      },
    });

    const stocksList = await request(app.getHttpServer())
      .get("/stocks?page=1")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send();

    expect(stocksList.body).toEqual({
      page: 1,
      totalStocks: 1,
      stocks: [
        expect.objectContaining({
          id: expect.any(String),
          stockName: "Orange Stock",
          stockOwner: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ],
    });
    expect(stocksList.statusCode).toEqual(200);
  });
});
