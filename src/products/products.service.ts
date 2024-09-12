import { Injectable, NotFoundException } from "@nestjs/common";
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
   * Creates a new product.
   *
   * @param createProductDto - The create product DTO.
   * @returns The created product.
   */
  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    console.log(product);

    return this.productRepository.save(product);
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
  async findOne(productCode?: string, location?: string): Promise<Product> {
    const request = {};

    if (productCode) request["productCode"] = productCode;

    if (location) request["location"] = location;

    if (Object.keys(request).length === 0) {
      throw new NotFoundException("No product code or location provided");
    }

    const product = await this.productRepository.findOne({ where: request });

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
    productCode: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    if (!productCode) throw new NotFoundException("No product code provided");

    const product = await this.productRepository.findOne({
      where: { productCode },
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
  async remove(productCode: string): Promise<void> {
    if (!productCode) throw new NotFoundException("No product code provided");
    const deletedProduct = await this.productRepository.delete({
      productCode,
    });
    if (deletedProduct.affected === 0)
      throw new NotFoundException("Product not found");
  }
}
