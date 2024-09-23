import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Delete,
  InternalServerErrorException,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Creates a product" })
  @ApiResponse({ status: 201, description: "Product successfully created" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 409, description: "Duplicate product" })
  @ApiResponse({ status: 500, description: "Internal server error" })

  /**
   * Creates a product.
   * @param createProductDto - The create product DTO.
   * @returns The created product.
   * @throws {InternalServerErrorException} If there is an error during creation.
   */
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const response = await this.productsService.create(createProductDto);
      return {
        ...response,
        price: response.price.toFixed(2),
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get("get")
  @ApiOperation({ summary: "Fetches a product" })
  @ApiResponse({ status: 200, description: "Product found" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })

  /**
   * Fetches a product.
   * @param productCode - The product code.
   * @param location - The location.
   * @returns The product.
   * @throws {InternalServerErrorException} If there is an error during fetching.
   */
  async findOne(
    @Query("productCode") productCode: number,
    @Query("location") location: ProductLocation
  ) {
    try {
      return await this.productsService.findOne(productCode, location);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put("update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Updates a product" })
  @ApiResponse({ status: 201, description: "Product successfully updated" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })

  /**
   * Updates a product.
   * @param productCode - The product code.
   * @param updateProductDto - The update product DTO.
   * @returns The updated product.
   * @throws {InternalServerErrorException} If there is an error during updating.
   */
  async update(
    @Query("productCode") productCode: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const response = await this.productsService.update(
        productCode,
        updateProductDto
      );
      return {
        ...response,
        price: response.price.toFixed(2),
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete("remove")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Removes a product" })
  @ApiResponse({ status: 201, description: "Product successfully removed" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })

  /**
   * Removes a product.
   * @param productCode - The product code.
   * @returns A promise that resolves if the product was successfully removed.
   * @throws {InternalServerErrorException} If there is an error during removing.
   */
  async remove(@Query("productCode") productCode: number) {
    try {
      return await this.productsService.remove(productCode);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
