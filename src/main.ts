import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { GeneralExceptionsFilter } from "./shared/utils/filter/general-exceptions-filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Motor Insurance API")
    .setDescription("API for motor insurance pricing")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  app.useGlobalFilters(new GeneralExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
