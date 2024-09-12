import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductTable1726147790241 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "PRODUCT",
        columns: [
          {
            name: "productCode",
            type: "varchar",
            isPrimary: true,
            isNullable: false,
            length: "255",
          },
          {
            name: "productDesc",
            type: "varchar",
            isNullable: true,
            length: "255",
          },
          {
            name: "location",
            type: "varchar",
            isNullable: false,
            length: "255",
          },
          {
            name: "price",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("PRODUCT");
  }
}
