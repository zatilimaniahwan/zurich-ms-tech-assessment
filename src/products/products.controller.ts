import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiQuery } from "@nestjs/swagger";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("create")
  /**
   * Creates a new product.
   *
   * @param createProductDto - The create product DTO.
   * @returns The created product.
   */
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get("get")
  /**
   * Gets a product by product code or location.
   *
   * @param productCode - The product code.
   * @param location - The location.
   * @returns The product.
   * @throws {NotFoundException} If the product is not found.
   */
  findOne(
    @Query("productCode")
    productCode: number,
    @Query("location") location: string
  ) {
    return this.productsService.findOne(productCode, location);
  }

  @Put("update")
  /**
   * Updates a product.
   *
   * @param productCode - The product code.
   * @param updateProductDto - The update product DTO.
   * @returns The updated product.
   * @throws {NotFoundException} If no product code is provided,
   *                              or if the product is not found.
   */
  update(
    @Query("productCode") productCode: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(productCode, updateProductDto);
  }

  @Delete("remove")
  /**
   * Removes a product.
   *
   * @param productCode - The product code.
   * @returns A promise that resolves if the product was successfully removed.
   * @throws {NotFoundException} If no product code is provided,
   *                              or if the product is not found.
   */
  remove(@Query("productCode") productCode: number) {
    return this.productsService.remove(productCode);
  }
}
