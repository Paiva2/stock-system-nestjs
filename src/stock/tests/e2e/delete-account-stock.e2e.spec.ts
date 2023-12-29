import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { StockModule } from "../../stock.module";
import { UserModule } from "../../../user/user.module";

describe("Delete account stock", () => {
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

  it("[DELETE]/stock/delete/:stockId", async () => {
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

    const stock = await prisma.stock.create({
      data: {
        stockName: "Orange Stock",
        stockOwner: user.id,
      },
    });

    const stockDelete = await request(app.getHttpServer())
      .delete(`/stock/delete/${stock.id}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send();

    const stocksList = await prisma.stock.findFirst({
      where: {
        id: stock.id,
      },
    });

    expect(stocksList).toEqual(null);
    expect(stockDelete.statusCode).toEqual(200);
    expect(stockDelete.body.message).toEqual("Stock deleted successfully.");
  });
});
