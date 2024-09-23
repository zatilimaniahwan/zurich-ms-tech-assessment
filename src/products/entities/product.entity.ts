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

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  /**
   * Set the price ensuring it is stored as a decimal with 2 decimal points.
   * @param value - The price value to set.
   */
  setPrice(value: number): void {
    if (isNaN(value)) {
      throw new Error("Invalid price value");
    }
    this.price = parseFloat(value.toFixed(2));
  }
}
