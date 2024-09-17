export class CreateProductDto {
  productCode: number;
  location: ProductLocation;
  price: number;
  productDesc?: string;
}
