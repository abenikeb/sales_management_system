import pool from "../service/DataBase";
import { CreateUserType, UserType } from "../dto";

export class User {
  tel: string;
  password: string;
  first_name?: string;
  last_name?: string;
  user_name: string;
  email?: string;
  verified?: boolean;
  salt?: string;
  otp?: number | string;
  otp_expiry?: Date;
  created_at?: Date;
  modified_at?: Date;
  user_group: number;
  constructor(UserInfo: UserType) {
    this.tel = UserInfo.tel;
    this.password = UserInfo.password;
    this.first_name = UserInfo.first_name;
    this.last_name = UserInfo.last_name;
    this.user_name = UserInfo.user_name;
    this.email = UserInfo.email;
    this.verified = false;
    this.salt = UserInfo.salt;
    this.otp = UserInfo.otp;
    this.otp_expiry = UserInfo.otp_expiry;
    this.created_at = new Date();
    this.modified_at = UserInfo.modified_at;
    this.user_group = UserInfo.user_group;
  }
  create() {
    const _sql = `INSERT INTO users (tel, password, first_name, last_name, user_name, email, verified, salt,otp, otp_expiry,
                  created_at, modified_at, user_group)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;

    const result = pool.query(_sql, [
      this.tel,
      this.password,
      this.first_name,
      this.last_name,
      this.user_name,
      this.email,
      this.verified,
      this.salt,
      this.otp,
      this.otp_expiry,
      this.created_at,
      this.modified_at,
      this.user_group,
    ]);
    return result;
  }
  static find() {
    const sql = `SELECT * FROM users`;
    return pool.query(sql);
  }

  static findIndex(ind1: number, ind2: number) {
    const sql = `SELECT U.id FROM users as U
                 WHERE U.user_group IN (${ind1},${ind2})`;
    return pool.query(sql);
  }

  static findOne(payload: { tel: string }) {
    const sql = `SELECT * FROM users WHERE tel = $1`;
    return pool.query(sql, [payload.tel]);
    // return result.rows.length > 0 ? true : false;
  }

  static findById(payload: { id: number }) {
    const sql = `SELECT * FROM users WHERE id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static save(profile: UserType) {
    const sql = `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *`;
    return pool.query(sql, [
      profile.first_name,
      profile.last_name,
      profile.email,
      profile.id,
    ]);
  }
}

export class Customer {
  first_name: string;
  last_name: string;
  category_id: number;
  business_licenses_no: string;
  plate_no: number;
  type_id: number;
  approved_by: number;
  territory: string;
  email: string;
  tel: string;
  lat: number;
  lng: number;
  city: string;
  created_at?: Date;
  modified_at?: Date;
  constructor(CustomerType: any) {
    this.first_name = CustomerType.first_name;
    this.last_name = CustomerType.last_name;
    this.category_id = CustomerType.category_id;
    this.business_licenses_no = CustomerType.business_licenses_no;
    this.plate_no = CustomerType.plate_no;
    this.type_id = CustomerType.type_id;
    this.approved_by = CustomerType.approved_by;
    this.territory = CustomerType.territory;
    this.email = CustomerType.email;
    this.tel = CustomerType.tel;
    this.lat = CustomerType.lat;
    this.lng = CustomerType.lng;
    this.city = CustomerType.city;
    this.created_at = new Date();
    this.modified_at = CustomerType.modified_at;
  }
  create() {
    const _sql = `INSERT INTO customers (tel, first_name, last_name, category_id, email, business_licenses_no, plate_no, type_id, approved_by,
                  territory,lat,lng, created_at, modified_at, city)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;

    const result = pool.query(_sql, [
      this.tel,
      this.first_name,
      this.last_name,
      this.category_id,
      this.email,
      this.business_licenses_no,
      this.plate_no,
      this.type_id,
      this.approved_by,
      this.territory,
      this.lat,
      this.lng,
      this.created_at,
      this.modified_at,
      this.city,
    ]);
    return result;
  }

  static find() {
    const sql = `SELECT * FROM customers`;
    return pool.query(sql);
  }

  static findOne(payload: { tel: string }) {
    const sql = `SELECT * FROM customers WHERE tel = $1`;
    return pool.query(sql, [payload.tel]);
  }

  static findById(payload: { id: number | string }) {
    const sql = `SELECT * FROM customers WHERE id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static findUsersCategory(payload: { customerId: number }) {
    const sql = `SELECT * FROM customers WHERE id = $1`;
    return pool.query(sql, [payload.customerId]);
  }

  static findBySearch(payload: { searchKey: number | string | undefined }) {
    const sql = `SELECT * FROM customers WHERE
                 first_name ILIKE '%${payload.searchKey}%' or
                 last_name ILIKE '%${payload.searchKey}%' or
                 email ILIKE '%${payload.searchKey}%' or
                 tel ILIKE '%${payload.searchKey}%'
                 ORDER BY id DESC`;

    return pool.query(sql);
  }

  static save(payload: { profile: any; id: number }) {
    const sql = `UPDATE customers SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *`;
    const { first_name, last_name, email } = payload.profile;
    return pool.query(sql, [first_name, last_name, email, payload.id]);
  }

  static findByIdAndRemove(payload: { id: number }) {
    const sql = `DELETE FROM customers WHERE id = $1 RETURNING *`;
    return pool.query(sql, [payload.id]);
  }
}

export class UserCategory {
  name: string;
  _desc?: string;
  created_at?: Date;
  modified_at?: Date;
  constructor(UserCategoryData: any) {
    // super(UserCategoryData);
    this.name = UserCategoryData.name;
    this._desc = UserCategoryData._desc;
    this.created_at = new Date();
    this.modified_at = UserCategoryData.modified_at;
  }

  Create() {
    const _sql = `INSERT INTO user_categories (name, _desc, created_at, modified_at)
                  VALUES($1, $2, $3, $4) 
                  RETURNING *`;
    return pool.query(_sql, [
      this.name,
      this._desc,
      this.created_at,
      this.modified_at,
    ]);
  }

  static find() {
    const sql = `SELECT * FROM user_categories`;
    return pool.query(sql);
  }

  static findById(payload: { id: number | string }) {
    const sql = `SELECT * FROM user_categories WHERE id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static findCustomer(payload: { id: number }) {
    const sql = `SELECT * FROM user_categories as U INNER JOIN customers as C ON
                 U.id = C.category_id WHERE U.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  static save(payload: { info: any; id: number }) {
    const sql = `UPDATE user_categories SET name = $1, _desc = $2, modified_at = $3 WHERE id = $4 RETURNING *`;
    const { name, _desc, modified_at } = payload.info;
    return pool.query(sql, [name, _desc, modified_at, payload.id]);
  }

  static findByIdAndRemove(payload: { id: number }) {
    const sql = `DELETE FROM user_categories WHERE id = $1 RETURNING *`;
    return pool.query(sql, [payload.id]);
  }

  static findByPriceAndCategoryByCategoryId(payload: { id: number }) {
    const sql = `SELECT P._desc, P.product_sku, P.product_images, P.created_at, PP.price, UG.name, UG.id FROM products as P
                 INNER JOIN product_prices as PP ON P.id = PP.product_id
                 INNER JOIN user_categories as UG ON PP.user_categories_id = UG.id                 
                 WHERE UG.id = $1`;
    return pool.query(sql, [payload.id]);
  }
}
