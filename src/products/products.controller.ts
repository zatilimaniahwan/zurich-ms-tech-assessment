import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Delete,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("create")
  @ApiBearerAuth() // Add Bearer Auth to the Swagger docs
  @ApiOperation({ summary: "Creates a product" })
  @ApiResponse({ status: 200, description: "Product successfully removed" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  /**
   * Creates a new product.
   *
   * @param createProductDto - The create product DTO.
   * @returns The created product.
   */
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    if (req.userRole !== "admin") {
      throw new UnauthorizedException("Only admins can access this route");
    }
    return this.productsService.create(createProductDto);
  }

  @Get("get")
  @ApiOperation({ summary: "Updates a product" })
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
    @Query("location") location: string
  ) {
    return this.productsService.findOne(productCode, location);
  }

  @Put("update")
  @ApiBearerAuth() // Add Bearer Auth to the Swagger docs
  @ApiOperation({ summary: "Updates a product" })
  @ApiResponse({ status: 200, description: "Product successfully updated" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
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
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any
  ) {
    if (req.userRole !== "admin") {
      throw new UnauthorizedException("Only admins can access this route");
    }
    return this.productsService.update(productCode, updateProductDto);
  }

  @Delete("remove")
  @ApiBearerAuth() // Add Bearer Auth to the Swagger docs
  @ApiOperation({ summary: "Removes a product" })
  @ApiResponse({ status: 200, description: "Product successfully removed" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Product not found" })
  /**
   * Removes a product.
   *
   * @param productCode - The product code.
   * @returns A promise that resolves if the product was successfully removed.
   * @throws {NotFoundException} If no product code is provided,
   *                              or if the product is not found.
   */
  remove(@Query("productCode") productCode: number, @Req() req: any) {
    if (req.userRole !== "admin") {
      throw new UnauthorizedException("Only admins can access this route");
    }
    return this.productsService.remove(productCode);
  }
}
