import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { Product } from "./entities/product.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { NotFoundException } from "@nestjs/common/exceptions";
import { UpdateProductDto } from "./dto/update-product.dto";

describe("ProductsService", () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  // create a new product
  describe("create a new product", () => {
    it("should create a new product", async () => {
      const createProductDto: CreateProductDto = {
        productCode: 1000,
        location: "West Malaysia",
        price: 300,
      };

      const result = createProductDto;

      jest.spyOn(repository, "create").mockImplementation(() => result as any);
      jest.spyOn(repository, "save").mockResolvedValue(result as any);

      expect(await service.create(createProductDto)).toEqual(result);
    });
  });

  // fetching a product
  describe("fetching a product", () => {
    it("should throw NotFoundException if neither productCode nor location is provided", async () => {
      await expect(service.findOne(null, null)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should fetch the product successfully", async () => {
      const productCode = 1000;
      const location = "West Malaysia";
      const product = { productCode, location } as Product;

      jest.spyOn(repository, "findOne").mockResolvedValue(product);

      const result = await service.findOne(productCode, location);

      expect(result).toEqual(product);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { productCode, location: "West Malaysia" },
      });
    });

    it("should throw NotFoundException if the product is not found", async () => {
      const productCode = 1000;
      const location = "West Malaysia";

      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      await expect(service.findOne(productCode, location)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  // updating a product
  describe("update", () => {
    it("should throw NotFoundException if no productCode is provided", async () => {
      const updateProductDto: UpdateProductDto = { location: "West Malaysia" };

      await expect(service.update(null, updateProductDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should update the product successfully", async () => {
      const productCode = 1000;
      const updateProductDto: UpdateProductDto = {
        location: "West Malaysia",
        price: 350,
      };
      const product = {
        productCode,
        location: "West Malaysia",
        price: 300,
      } as Product;

      const updatedProduct = { ...product, ...updateProductDto };

      jest.spyOn(repository, "findOne").mockResolvedValue(product);
      jest.spyOn(repository, "save").mockResolvedValue(updatedProduct);

      const result = await service.update(productCode, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { productCode, location: "West Malaysia" },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedProduct);
    });
  });

  // removing a product
  describe("remove a product", () => {
    it("should throw NotFoundException if no productCode is provided", async () => {
      await expect(service.remove(null)).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if no product is found with the provided productCode", async () => {
      const productCode = 1000;

      jest
        .spyOn(repository, "delete")
        .mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(productCode)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should successfully delete a product if found", async () => {
      const productCode = 1000;

      jest
        .spyOn(repository, "delete")
        .mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.remove(productCode)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith({ productCode });
    });
  });
});
