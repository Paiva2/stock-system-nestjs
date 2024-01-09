import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Filter category by name controller", () => {
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

  it("[GET]/category/:categoryId", async () => {
    const hashPassword = await hash("123456", 8);

    const user = await prisma.user.create({
      data: {
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: hashPassword,
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
        role: "admin",
      },
    });

    const userAttatchment = await prisma.userAttatchments.create({
      data: {
        userId: user.id,
      },
    });

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const categoryCreation = await prisma.category.create({
      data: {
        name: "Fruits",
        userAttatchmentsId: userAttatchment.id,
      },
    });

    const filterCategory = await request(app.getHttpServer())
      .get(`/category?categoryName=Fruits`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send();

    expect(filterCategory.body).toEqual(
      expect.objectContaining({
        id: categoryCreation.id,
        name: "Fruits",
        createdAt: expect.any(String),
        userAttatchmentsId: userAttatchment.id,
      })
    );
    expect(filterCategory.statusCode).toEqual(200);
  });
});
