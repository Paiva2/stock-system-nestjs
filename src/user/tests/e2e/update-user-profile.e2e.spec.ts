import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { compare, hash } from "bcrypt";
import { UserModule } from "../../user.module";
import { PrismaService } from "../../../infra/database/prisma.service";

describe("Update user profile controller", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  it("[PATCH]/profile", async () => {
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

    const updateProfile = await request(app.getHttpServer())
      .patch("/profile")
      .send({
        fullName: "Update fullName",
        email: "updateemail@email.com",
        password: "updatePass",
      })
      .set("Authorization", `Bearer ${jwtToken}`);

    const profileUpdated = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const passwordsMatches = await compare(
      "updatePass",
      profileUpdated.password,
    );

    expect(updateProfile.statusCode).toEqual(200);
    expect(updateProfile.body.message).toEqual("Profile updated successfully.");

    expect(passwordsMatches).toBeTruthy();
    expect(profileUpdated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "updateemail@email.com",
        fullName: "Update fullName",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        role: "default",
      }),
    );
  });
});
