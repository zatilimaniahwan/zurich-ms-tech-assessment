import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Delete,
  Req,
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
  @ApiResponse({ status: 201, description: "Product successfully removed" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 409, description: "Duplicate product" })

  /**
   * Creates a product.
   *
   * @param createProductDto - The create product DTO.
   * @param req - The express request object.
   * @returns The created product.
   * @throws {UnauthorizedException} If the user is not an admin.
   * @throws {ConflictException} If a product with the same location and product code already exists.
   */
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get("get")
  @ApiOperation({ summary: " Fetchs a product" })
  @ApiResponse({ status: 200, description: "Product found" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
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
    @Query("location") location: ProductLocation
  ) {
    return this.productsService.findOne(productCode, location);
  }

  @Put("update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Updates a product" })
  @ApiResponse({ status: 201, description: "Product successfully updated" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
  /**
   * Updates a product.
   *
   * @param productCode - The product code.
   * @param updateProductDto - The update product DTO.
   * @returns The updated product.
   * @throws {UnauthorizedException} If the user is not an admin.
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
  @ApiBearerAuth()
  @ApiOperation({ summary: "Removes a product" })
  @ApiResponse({ status: 201, description: "Product successfully removed" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })

  /**
   * Removes a product.
   *
   * @param productCode - The product code.
   * @returns A promise that resolves if the product was successfully removed.
   * @throws {NotFoundException} If no product code is provided,
   *                              or if the product is not found.
   * @throws {UnauthorizedException} If the user is not an admin.
   */
  remove(@Query("productCode") productCode: number) {
    return this.productsService.remove(productCode);
  }
}
