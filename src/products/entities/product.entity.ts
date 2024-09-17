import { UUID } from "crypto";
import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("PRODUCT")
@Unique(["productCode", "location"])
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: UUID;

  @Column()
  productCode: number;

  @Column({ nullable: true })
  productDesc: string;

  @Column()
  location: string;

  @Column()
  price: number;
}
