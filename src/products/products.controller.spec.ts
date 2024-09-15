import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

// Mock the repository methods
const mockProductRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository(),
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
