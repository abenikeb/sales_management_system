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
    const sql = `SELECT P.id, P._desc, P.product_sku, P.product_images, P.created_at, PP.price, UG.name, UG.id FROM products as P
                 INNER JOIN product_prices as PP ON P.id = PP.product_id
                 INNER JOIN user_categories as UG ON PP.user_categories_id = UG.id                 
                 WHERE UG.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  // static findInId(payload: { items: Array<any> }) {
  //   //     const sql = `
  //   //                 top_regions AS (
  //   //                 SELECT products.id
  //   //                 FROM products
  //   //                 WHERE products.id = (SELECT $1 FROM products)
  //   //             )
  //   // SELECT * FROM products WHERE products.id IN ($1::int[])`;
  //   // const sql = `for products.id in $1
  //   //                   from products
  //   //                   limit 10
  //   //                 loop
  //   //                 raise notice '% - % ', f.product_id
  //   //                 end loop`;

  //   const resultArray = [] as any;
  //   const itemsCollection = _.map(payload.items, (item) => item);

  //   return _.forEach(itemsCollection, (item) => {
  //     const sql = `SELECT products.product_sku FROM products WHERE products.id = $1`;
  //     return pool.query(sql, [item.product_id]);
  //   });
  //   // for (let idx = 0; idx <= 1; idx++) {
  //   // }
  //   // const result = pool.query(sql, [itemsCollection[0]]);
  // }

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
