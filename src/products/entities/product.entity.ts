import { UUID } from "crypto";
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("PRODUCT")
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
