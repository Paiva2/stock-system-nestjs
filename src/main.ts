import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Stock API - NestJS")
    .setDescription("Stock System simple documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("User")
    .addTag("Stock")
    .addTag("Item")
    .addTag("Category")
    .addTag("Stock Item")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}

bootstrap();
