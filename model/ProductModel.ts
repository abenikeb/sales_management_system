import pool from "../service/DataBase";
import { ProductType } from "../dto";

export class Product {
  _desc: string;
  product_images?: [string];
  product_sku: number;
  created_by: number;
  created_at: Date;
  modified_at?: Date;
  constructor(ProductInfo: ProductType) {
    this._desc = ProductInfo._desc;
    this.product_images = ProductInfo.product_images;
    this.product_sku = ProductInfo.product_sku;
    this.created_by = ProductInfo.created_by;
    this.created_at = new Date();
    this.modified_at = new Date();
  }

  create() {
    const _sql = `INSERT INTO products (_desc, product_images, product_sku, created_by, created_at, modified_at)
                  VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

    const result = pool.query(_sql, [
      this._desc,
      this.product_images,
      this.product_sku,
      this.created_by,
      this.created_at,
      this.modified_at,
    ]);
    return result;
  }

  static findOne(payload: { email: string }) {
    const sql = `SELECT * FROM products WHERE email = $1`;
    return pool.query(sql, [payload.email]);
  }

  // static findById(payload: { id: number }) {
  //   const sql = `SELECT * FROM products INNER JOIN product_categories ON
  //               products.category_id = product_categories.id WHERE products.id = $1`;
  //   return pool.query(sql, [payload.id]);
  // }

  static findById(payload: { id: number }) {
    const sql = `SELECT * FROM products WHERE products.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  //   static save(profile: ProductType, id: number) {
  //     const sql = `UPDATE products SET name = $1, address_line1 = $2, tag_id = $3, email = $4, tel = $5,
  //     password = $6 WHERE id = $7 RETURNING *`;
  //     const { name, address_line1, address_line2, email, tel, password } =
  //       profile;
  //     return pool.query(sql, [
  //       name,
  //       address_line1,
  //       address_line2,
  //       email,
  //       tel,
  //       password,
  //       id,
  //     ]);
  //   }

  //   static saveSevice(profile: ProductType, id: number) {
  //     const sql = `UPDATE venders SET service_available = $1, lat = $2, lng = $3 WHERE id = $4 RETURNING *`;
  //     const { service_available, lat, lng } = profile;
  //     return pool.query(sql, [service_available, lat, lng, id]);
  //   }
}
