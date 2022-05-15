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
