import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcrypt";
import { PrismaService } from "../../../infra/database/prisma.service";
import { AppModule } from "../../../app.module";

describe("Create category controller", () => {
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

  it("[POST]/category", async () => {
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

    const userAttatchmentId = await prisma.userAttatchments.create({
      data: { userId: user.id },
    });

    const signIn = await request(app.getHttpServer()).post("/sign-in").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const jwtToken = signIn.body.access_token;

    const categoryCreation = await request(app.getHttpServer())
      .post("/category")
      .send({ categoryName: "Fruits" })
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(categoryCreation.body.message).toEqual("Category successfully created.");
    expect(categoryCreation.statusCode).toEqual(201);

    const getNewCategory = await prisma.category.findFirst({
      where: {
        name: "Fruits",
      },
    });

    expect(getNewCategory).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Fruits",
        createdAt: expect.any(Date),
        userAttatchmentsId: userAttatchmentId.id,
      })
    );
  });
});
