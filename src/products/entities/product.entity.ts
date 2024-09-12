import { UUID } from "crypto";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("PRODUCT")
export class Product {
  @PrimaryColumn()
  productCode: string;

  @Column()
  productDesc: string;

  @Column()
  location: string;

  @Column()
  price: number;
}
