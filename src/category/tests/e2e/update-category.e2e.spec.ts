import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Update category controller", () => {
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

  it("[PATCH]/category", async () => {
    const hashPassword = await hash("123456", 8);

    await prisma.user.create({
      data: {
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: hashPassword,
        secretQuestion: "Favourite Band",
        secretAnswer: "The Beatles",
        role: "admin",
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
      },
    });

    const categoryUpdate = await request(app.getHttpServer())
      .patch("/category")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        id: categoryCreation.id,
        name: "Shirts",
      });

    expect(categoryUpdate.body.message).toEqual(
      "Category successfully updated.",
    );
    expect(categoryUpdate.statusCode).toEqual(200);

    const getCategoryUpdated = await prisma.category.findFirst({
      where: {
        id: categoryCreation.id,
      },
    });

    expect(getCategoryUpdated).toEqual(
      expect.objectContaining({
        id: getCategoryUpdated.id,
        name: "Shirts",
        createdAt: expect.any(Date),
      }),
    );
  });
});
