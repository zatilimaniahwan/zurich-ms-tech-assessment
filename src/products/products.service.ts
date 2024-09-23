import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  /**
   * Constructor.
   *
   * @param productRepository - The product repository.
   */
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  validateLocation = (location: string) => {
    const allowedLocations: ProductLocation[] = [
      "West Malaysia",
      "East Malaysia",
    ];

    if (!allowedLocations.includes(location as ProductLocation)) {
      throw new BadRequestException("Invalid location value provided");
    }
  };

  /**
   * Creates a new product.
   *
   * @param createProductDto - The create product DTO.
   * @returns The created product.
   * @throws {BadRequestException} If the provided location is not valid. Allowed locations are "West Malaysia" and "East Malaysia".
   * @throws {ConflictException} If a product with the same location and product code already exists.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { productCode, location, price } = createProductDto;

    if (!productCode || !location || price == null) {
      throw new Error("Product code, location and price are required");
    }

    this.validateLocation(location);

    const existingProduct = await this.productRepository.findOne({
      where: { location, productCode },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with location ${location} and product code ${productCode} already exists`
      );
    }

    const product = new Product();
    product.productCode = productCode;
    product.location = location;
    product.setPrice(price);

    return await this.productRepository.save(product);
  }

  /**
   * Retrieves a product by its product code and location.
   * @param productCode - The product code.
   * @param location - The location.
   * @returns The product.
   * @throws {BadRequestException} If neither productCode nor location is provided.
   * @throws {NotFoundException} If the product is not found.
   */
  async findOne(
    productCode: number,
    location: ProductLocation
  ): Promise<Product> {
    if (!productCode && !location) {
      throw new BadRequestException("No product code or location provided");
    }

    this.validateLocation(location);

    const product = await this.productRepository.findOne({
      where: { productCode, location },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  /**
   * Updates a product.
   * @param productCode - The product code.
   * @param updateProductDto - The update product DTO.
   * @returns The updated product.
   * @throws {BadRequestException} If no product code is provided.
   * @throws {Error} If location and price are not provided.
   * @throws {NotFoundException} If the product is not found.
   */
  async update(
    productCode: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const { location, price } = updateProductDto;

    if (!productCode) {
      throw new BadRequestException("No product code provided");
    }

    if (!location || price == null) {
      throw new Error("Location and price are required");
    }

    this.validateLocation(updateProductDto.location);

    const product = await this.productRepository.findOne({
      where: { productCode },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (updateProductDto.price) product.setPrice(updateProductDto.price);

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  /**
   * Removes a product.
   * @param productCode - The product code of the product to be removed.
   * @returns A promise that resolves if the product was successfully removed.
   * @throws {BadRequestException} If no product code is provided.
   * @throws {NotFoundException} If the product is not found.
   */
  async remove(productCode: number): Promise<void> {
    if (!productCode) {
      throw new BadRequestException("No product code provided");
    }

    const result = await this.productRepository.delete({ productCode });

    if (result.affected === 0) {
      throw new NotFoundException("Product not found");
    }
  }
}
