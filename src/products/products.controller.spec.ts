import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtService } from "@nestjs/jwt";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import { Product } from "./entities/product.entity";

describe("ProductsController", () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import your main app module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  // This tests will cover the routes that require a valid JWT token

  it("should create a product with valid JWT token and the role is an admin role", async () => {
    const validToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwic3ViIjoiMTIzNDUiLCJpYXQiOjE3MjY0MjA3NzV9.HVdUYC_ETfFlAJ_zDMczRmj28dmDOmsTKLDKUvqezlA"; // Replace with your valid token
    const createProductDto: CreateProductDto = {
      productCode: 9000,
      location: "West",
      price: 1,
    };

    // Mocking ProductsService to ensure it handles the request correctly
    const productsService = app.get<ProductsService>(ProductsService);
    jest
      .spyOn(productsService, "create")
      .mockResolvedValue(createProductDto as Product);

    const response = await request(app.getHttpServer())
      .post("/products/create")
      .set("Authorization", `Bearer ${validToken}`)
      .set("Accept", "*/*")
      .send(createProductDto)
      .expect(201);

    expect(response.body).toEqual(createProductDto);
    expect(response.body.productCode).toBe(createProductDto.productCode);
    expect(response.body.location).toBe(createProductDto.location);
    expect(response.body.price).toBe(createProductDto.price);
  });

  it("should deny access with invalid JWT token or the role is user role", async () => {
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdlbmVyYWwiLCJyb2xlIjoicHVibGljIiwic3ViIjoiMTIzNDUiLCJpYXQiOjE3MjY0MTYwMzF9.6Vv2MHkfl9QdEaFyxT3gPqO9wp95El3OKNN-1Lsj5mM ";
    const createProductDto: CreateProductDto = {
      productCode: 9000,
      location: "West Malaysia",
      price: 1,
    };

    const response = await request(app.getHttpServer())
      .post("/products/create")
      .set("Authorization", `Bearer ${invalidToken}`)
      .set("Accept", "*/*")
      .send(createProductDto)
      .expect(401);

    expect(response.body.message).toBe("Invalid or expired token");
  });
});
