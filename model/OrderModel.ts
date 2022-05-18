import pool from "../service/DataBase";
import { OrderPrice, OrderType, VAT_PERCENT, EXCISE_PERCENT } from "../dto";

export class CreateOrderType {
  orderId: number;
  netPrice: number;
  addedTax?: number;
  excise_tax?: number;
  grossPrice?: number;
  remarks?: string;
  customer_id: string;
  status: number;
  approved_by: string;
  payment_via?: string;
  created_at: Date = new Date();
  modified_at?: Date;

  constructor(order: OrderType) {
    this.orderId = order.orderId;
    this.netPrice = order.netPrice;
    this.addedTax = GenerateOrderPrice(this.netPrice).addedTax;
    this.excise_tax = GenerateOrderPrice(this.netPrice).exciseTax;
    /** Calculate the default price from the total price */
    this.grossPrice = GenerateOrderPrice(
      // Calculate Net Price
      this.netPrice
    ).grossPrice;
    this.remarks = order.remarks;
    this.status = order.status || 1;
    this.customer_id = order.customer_id;
    this.payment_via = order.payment_via;
    this.approved_by = order.approved_by;
    this.modified_at = order.modified_at;
  }

  create() {
    const _sql = `INSERT INTO orders (orderId, net_price, add_tax, excise_tax, gross_price, remarks, status, customer_id,
                   payment_via, approved_by, created_at, modified_at)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;

    const result = pool.query(_sql, [
      this.orderId,
      this.netPrice,
      this.addedTax,
      this.excise_tax,
      this.grossPrice,
      this.remarks,
      this.status,
      this.customer_id,
      this.payment_via,
      this.approved_by,
      this.created_at,
      this.modified_at,
    ]);
    return result;
  }

  static save(profile: OrderType) {
    const sql = `UPDATE orders SET status = $1 RETURNING *`;
    return pool.query(sql, [profile.status]);
  }
}

export class CreateOrderItem {
  order_id: number;
  product_id: number;
  promotion: boolean;
  quantity?: number;

  constructor(order: any) {
    this.order_id = order.order_id;
    this.product_id = order.product_id;
    this.promotion = order.promotion;
    this.quantity = order.quantity || 1;
  }

  create() {
    const _sql = `INSERT INTO order_items (order_id, product_id, promotion, quantity)
                  VALUES($1, $2, $3, $4) RETURNING *`;

    const result = pool.query(_sql, [
      this.order_id,
      this.product_id,
      this.promotion,
      this.quantity,
    ]);
    return result;
  }

  static findByOrderId(payload: { id: number }) {
    const sql = `SELECT * FROM order_items WHERE order_items.order_id = $1`;
    return pool.query(sql, [payload.id]);
  }
}

export class CreateReportItem {
  customer_id: number;
  user_categories_id: number;
  product_id: number;
  promotion: boolean;
  quantity: number;
  created_at: Date;

  constructor(order: any) {
    this.customer_id = order.customer_id;
    this.user_categories_id = order.user_categories_id;
    this.product_id = order.product_id;
    this.promotion = order.promotion;
    this.quantity = order.quantity || 1;
    this.created_at = new Date();
  }

  create() {
    const _sql = `INSERT INTO report (customer_id,user_categories_id, product_id, promotion, quantity, created_at)
                  VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

    const result = pool.query(_sql, [
      this.customer_id,
      this.user_categories_id,
      this.product_id,
      this.promotion,
      this.quantity,
      this.created_at,
    ]);
    return result;
  }
}

export class OrderNotification {
  message: string;
  header: string;
  isRead: boolean;
  type?: Readonly<number>;
  receiver_id: number;
  status?: number;
  link_url: string;
  created_at: Date = new Date();
  modified_at?: Date;

  constructor(orderNotification: OrderNotification) {
    this.message = orderNotification.message;
    this.header = orderNotification.header;
    this.isRead = false;
    this.type = orderNotification.type;
    this.receiver_id = orderNotification.receiver_id;
    this.link_url = orderNotification.link_url;
    this.status = orderNotification.status || 1;
    this.modified_at = new Date();
  }
  create() {
    const _sql = `INSERT INTO notifications (message, header, type, receiver_id, status, created_at, link_url, modified_at)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const result = pool.query(_sql, [
      this.message,
      this.header,
      // this.isRead,
      this.type,
      this.receiver_id,
      this.status,
      this.created_at,
      this.link_url,
      this.modified_at,
    ]);
    return result;
  }
}

// Helpers
export const GenerateOrderPrice = (netPrice: number): OrderPrice => {
  const orderPrice: OrderPrice = {
    netPrice: netPrice,
    exciseTax: EXCISE_PERCENT * netPrice,
    addedTax: VAT_PERCENT * netPrice,
  };

  orderPrice.grossPrice =
    (orderPrice.exciseTax + netPrice) * VAT_PERCENT +
    (orderPrice.exciseTax + netPrice);

  return orderPrice;
};
