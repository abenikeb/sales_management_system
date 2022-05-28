import pool from "../service/DataBase";
import { ProductType } from "../dto";
import _ from "lodash";

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

  static find() {
    const sql = `SELECT * FROM products`;
    return pool.query(sql);
  }

  static findOne(payload: { _sku: number }) {
    const sql = `SELECT * FROM products WHERE product_sku = $1`;
    return pool.query(sql, [payload._sku]);
  }

  static findById(payload: { id: number }) {
    const sql = `SELECT * FROM products WHERE products.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static findByPrice(payload: { id: number }) {
    const sql = `SELECT products.id, products.product_sku, products._desc, products.created_by, product_prices.price
                 FROM products INNER JOIN product_prices ON products.id = product_prices.product_id WHERE products.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static findByUserId(payload: { userId: number }) {
    const sql = `SELECT * FROM products WHERE products.created_by = $1`;
    return pool.query(sql, [payload.userId]);
  }

  static save(payload: { info: any; id: number }) {
    const sql = `UPDATE products SET product_sku = $1, _desc = $2, modified_at = $3 WHERE id = $4 RETURNING *`;
    const { product_sku, _desc, modified_at } = payload.info;
    return pool.query(sql, [product_sku, _desc, modified_at, payload.id]);
  }

  static findByIdAndRemove(payload: { id: number }) {
    const sql = `DELETE FROM products WHERE id = $1 RETURNING *`;
    return pool.query(sql, [payload.id]);
  }

  static findByPriceAndCategory() {
    const sql = `SELECT P.id, P._desc, P.product_sku, P.product_images, P.created_at, PP.price, UG.name
                 FROM products as P JOIN product_prices as PP
                 ON P.id = PP.product_id INNER JOIN user_categories as UG
                 ON PP.user_categories_id = UG.id`;
    return pool.query(sql);
  }

  static findByPriceAndCategoryByCategoryId(payload: { id: number }) {
    const sql = `SELECT P.id as id2, P._desc, P.product_sku, P.product_images, P.created_at, PP.price, UG.name, UG.id FROM products as P
                 INNER JOIN product_prices as PP ON P.id = PP.product_id
                 INNER JOIN user_categories as UG ON PP.user_categories_id = UG.id                 
                 WHERE UG.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static findWithPriceAndPromotionById(payload: {
    id: number;
    user_categories_id: number;
  }) {
    const sql = `SELECT P.id, P.product_sku, P._desc, P.created_by, PP.price, PPT.amount_price FROM products as P 
                 INNER JOIN product_prices as PP ON P.id = PP.product_id 
                 INNER JOIN product_promotion as PPT ON P.id = PPT.product_id
                 WHERE P.id = ${payload.id} AND 
                              PP.user_categories_id = ${payload.user_categories_id} AND
                              PPT.user_categories_id = ${payload.user_categories_id}`;
    return pool.query(sql);
  }
}

export class ProductPrice {
  product_id: string;
  user_categories_id?: [string];
  price: number;
  created_at: Date;
  modified_at?: Date;
  constructor(ProductPriceInfo: any) {
    this.product_id = ProductPriceInfo.product_id;
    this.user_categories_id = ProductPriceInfo.user_categories_id;
    this.price = ProductPriceInfo.price;
    this.created_at = new Date();
    this.modified_at = new Date();
  }

  create() {
    const _sql = `INSERT INTO product_prices (product_id, price, user_categories_id, created_at, modified_at)
                  VALUES($1, $2, $3, $4, $5) RETURNING *`;

    const result = pool.query(_sql, [
      this.product_id,
      this.price,
      this.user_categories_id,
      this.created_at,
      this.modified_at,
    ]);
    return result;
  }

  // static findOne(payload: { product_id: number; category_id: number }) {
  //   const sql = `SELECT * FROM product_prices WHERE
  //                product_id = $1 AND user_categories_id = $2`;
  //   return pool.query(sql, [payload.product_id, payload.category_id]);
  // }

  static findById(payload: { id: number }) {
    const sql = `SELECT * FROM product_prices WHERE product_prices.product_id = $1`;
    return pool.query(sql, [payload.id]);
  }
}

export class ProductPromotion {
  product_id: string;
  user_categories_id?: [string];
  amount_price: number;
  created_at: Date;
  modified_at?: Date;
  constructor(ProductPriceInfo: any) {
    this.product_id = ProductPriceInfo.product_id;
    this.user_categories_id = ProductPriceInfo.user_categories_id;
    this.amount_price = ProductPriceInfo.amount_price;
    this.created_at = new Date();
    this.modified_at = new Date();
  }

  create() {
    const _sql = `INSERT INTO product_promotion (product_id, amount_price, user_categories_id, created_at, modified_at)
                  VALUES($1, $2, $3, $4, $5) RETURNING *`;

    const result = pool.query(_sql, [
      this.product_id,
      this.amount_price,
      this.user_categories_id,
      this.created_at,
      this.modified_at,
    ]);
    return result;
  }
}
