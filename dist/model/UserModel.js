"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCategory = exports.Customer = exports.User = void 0;
const DataBase_1 = __importDefault(require("../service/DataBase"));
class User {
    constructor(UserInfo) {
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
        const result = DataBase_1.default.query(_sql, [
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
        return DataBase_1.default.query(sql);
    }
    static findIndex(payload) {
        const sql = `SELECT U.id FROM users as U
                 WHERE U.user_group IN (${payload._index1},${payload._index2})`;
        return DataBase_1.default.query(sql);
    }
    static findOne(payload) {
        const sql = `SELECT * FROM users WHERE tel = $1`;
        return DataBase_1.default.query(sql, [payload.tel]);
    }
    static findById(payload) {
        const sql = `SELECT * FROM users WHERE id = $1`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
    static save(profile) {
        const sql = `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *`;
        return DataBase_1.default.query(sql, [
            profile.first_name,
            profile.last_name,
            profile.email,
            profile.id,
        ]);
    }
}
exports.User = User;
class Customer {
    constructor(CustomerType) {
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
        const result = DataBase_1.default.query(_sql, [
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
    // find a customer including customer category
    static find() {
        const sql = `SELECT c.*, u.name FROM customers as c LEFT JOIN user_categories as 
                 u ON c.category_id = u.id`;
        return DataBase_1.default.query(sql);
    }
    static findOne(payload) {
        const sql = `SELECT * FROM customers WHERE tel = $1`;
        return DataBase_1.default.query(sql, [payload.tel]);
    }
    static findById(payload) {
        const sql = `SELECT * FROM customers WHERE id = $1`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
    static findUsersCategory(payload) {
        const sql = `SELECT * FROM customers WHERE id = $1`;
        return DataBase_1.default.query(sql, [payload.customerId]);
    }
    static findBySearch(payload) {
        const sql = `SELECT * FROM customers WHERE
                 first_name ILIKE '%${payload.searchKey}%' or
                 last_name ILIKE '%${payload.searchKey}%' or
                 email ILIKE '%${payload.searchKey}%' or
                 tel ILIKE '%${payload.searchKey}%'
                 ORDER BY id DESC`;
        return DataBase_1.default.query(sql);
    }
    static save(payload) {
        const sql = `UPDATE customers SET first_name = $1, last_name = $2, email = $3, tel = $4, territory = $5,
                 city = $6, category_id = $7, business_licenses_no = $8, plate_no = $9, type_id = $10 
                 WHERE id = $11`;
        const { first_name, last_name, email, tel, territory, city, category_id, business_licenses_no, plate_no, type_id, id, } = payload.profile;
        return DataBase_1.default.query(sql, [
            first_name,
            last_name,
            email,
            tel,
            territory,
            city,
            category_id,
            business_licenses_no,
            plate_no,
            type_id,
            payload.customerId,
        ]);
    }
    static findByIdAndRemove(payload) {
        const sql = `DELETE FROM customers WHERE id = $1 RETURNING *`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
    static findPayementTypeId() {
        const sql = `SELECT * FROM payment_type`;
        return DataBase_1.default.query(sql);
    }
}
exports.Customer = Customer;
class UserCategory {
    constructor(UserCategoryData) {
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
        return DataBase_1.default.query(_sql, [
            this.name,
            this._desc,
            this.created_at,
            this.modified_at,
        ]);
    }
    static find() {
        const sql = `SELECT * FROM user_categories`;
        return DataBase_1.default.query(sql);
    }
    static findById(payload) {
        const sql = `SELECT * FROM user_categories WHERE id = $1`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
    static findCustomer(payload) {
        const sql = `SELECT * FROM user_categories as U INNER JOIN customers as C ON
                 U.id = C.category_id WHERE U.id = $1`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
    static save(payload) {
        const sql = `UPDATE user_categories SET name = $1, _desc = $2, modified_at = $3 WHERE id = $4 RETURNING *`;
        const { name, _desc, modified_at } = payload.info;
        return DataBase_1.default.query(sql, [name, _desc, modified_at, payload.id]);
    }
    static findByIdAndRemove(payload) {
        const sql = `DELETE FROM user_categories WHERE id = $1 RETURNING *`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
    static findByPriceAndCategoryByCategoryId(payload) {
        const sql = `SELECT P._desc, P.id, P.product_sku, P.product_images, P.created_at, PP.price, UG.name FROM products as P
                 INNER JOIN product_prices as PP ON P.id = PP.product_id
                 INNER JOIN user_categories as UG ON PP.user_categories_id = UG.id                 
                 WHERE UG.id = $1`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
}
exports.UserCategory = UserCategory;
