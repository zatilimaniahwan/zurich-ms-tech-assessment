export class CreateProductDto {
  productCode: number;
  location: ProductLocation | string;
  price: number;
  productDesc?: string;
}
