import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserModule } from "../../user.module";

describe("Register user controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it("[POST]/register", async () => {
    const postRegister = await request(app.getHttpServer())
      .post("/register")
      .send({
        email: "johndoe@email.com",
        fullName: "John Doe",
        password: "123456",
      });

    expect(postRegister.statusCode).toBe(201);
    expect(postRegister.body.message).toEqual("User registered successfully!");
  });
});
