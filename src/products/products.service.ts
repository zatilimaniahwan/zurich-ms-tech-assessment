import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";

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

  /**
   * Creates a product.
   *
   * @param createProductDto - The create product DTO.
   * @returns The created product.
   * @throws {BadRequestException} If the location value is invalid.
   * @throws {ConflictException} If a product with the same location and product code already exists.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate the location value
    const allowedLocations: ProductLocation[] = [
      "West Malaysia",
      "East Malaysia",
    ];
    if (
      !allowedLocations.includes(createProductDto.location as ProductLocation)
    ) {
      throw new BadRequestException("Invalid location value provided");
    }

    // Check for existing product with the same location and product code
    const existingProduct = await this.productRepository.findOne({
      where: {
        location: createProductDto.location,
        productCode: createProductDto.productCode,
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        "Product with this location and product code already exists"
      );
    }

    // Create and save the new product
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Gets a product by product code or location.
   *
   * @param productCode - The product code.
   * @param location - The location.
   * @returns The product.
   * @throws {NotFoundException} If no product code or location is provided,
   *                              or if the product is not found.
   */
  async findOne(
    productCode: number,
    location: ProductLocation
  ): Promise<Product> {
    if (!productCode && !location) {
      throw new NotFoundException("No product code and location provided");
    }

    const product = await this.productRepository.findOne({
      where: { productCode, location },
    });

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }

  /**
   * Updates a product.
   *
   * @param productCode - The product code.
   * @param updateProductDto - The update product DTO.
   * @returns The updated product.
   * @throws {NotFoundException} If no product code is provided,
   *                              or if the product is not found.
   */
  async update(
    productCode: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    if (!productCode) throw new NotFoundException("No product code provided");

    // need to check the location of the product since the productCode is not unique
    const product = await this.productRepository.findOne({
      where: { productCode, location: updateProductDto.location },
    });

    if (!product) throw new NotFoundException("Product not found");

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  /**
   * Removes a product.
   *
   * @param productCode - The product code.
   * @returns A promise that resolves if the product was successfully removed.
   * @throws {NotFoundException} If no product code is provided,
   *                              or if the product is not found.
   */
  async remove(productCode: number): Promise<void> {
    if (!productCode) throw new NotFoundException("No product code provided");
    const deletedProduct = await this.productRepository.delete({
      productCode,
    });
    if (deletedProduct.affected === 0)
      throw new NotFoundException("Product not found");
  }
}
