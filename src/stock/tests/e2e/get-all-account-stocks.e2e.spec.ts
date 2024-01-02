import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";
import { IUser } from "../../../@types/types";

describe("Get all account stocks", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let user: IUser;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    await app.init();

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
  });

  test("[GET]/stocks?page=1", async () => {
    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const stockMocked = await prisma.stock.create({
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

    await prisma.stock.delete({
      where: {
        id: stockMocked.id,
      },
    });
  });

  test("[GET]/stocks?active=true&page=1", async () => {
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

    await prisma.stock.create({
      data: {
        stockName: "Apple Stock",
        stockOwner: user.id,
      },
    });

    const stocksList = await request(app.getHttpServer())
      .get("/stocks?active=true&page=1")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send();

    expect(stocksList.body).toEqual({
      page: 1,
      totalStocks: 2,
      active: true,
      stocks: [
        expect.objectContaining({
          id: expect.any(String),
          stockName: "Orange Stock",
          stockOwner: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          active: true,
        }),

        expect.objectContaining({
          id: expect.any(String),
          stockName: "Apple Stock",
          stockOwner: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          active: true,
        }),
      ],
    });
    expect(stocksList.statusCode).toEqual(200);
  });

  test("[GET]/stocks?active=false&page=1", async () => {
    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
        active: false,
      },
    });

    await prisma.stock.create({
      data: {
        stockName: "Apple Stock",
        stockOwner: user.id,
        active: false,
      },
    });

    const stocksList = await request(app.getHttpServer())
      .get("/stocks?active=false&page=1")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send();

    expect(stocksList.body).toEqual({
      page: 1,
      totalStocks: 2,
      active: false,
      stocks: [
        expect.objectContaining({
          id: expect.any(String),
          stockName: "Orange Stock",
          stockOwner: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          active: false,
        }),

        expect.objectContaining({
          id: expect.any(String),
          stockName: "Apple Stock",
          stockOwner: user.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          active: false,
        }),
      ],
    });
    expect(stocksList.statusCode).toEqual(200);
  });
});
