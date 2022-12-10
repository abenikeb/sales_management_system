"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionDecimal = exports.GenerateOrderPrice = exports.OrderNotification = exports.CreateReportItem = exports.CreateOrderItem = exports.CreateOrderType = void 0;
const DataBase_1 = __importDefault(require("../service/DataBase"));
const dto_1 = require("../dto");
class CreateOrderType {
    constructor(order) {
        this.created_at = new Date();
        this.orderId = order.orderId;
        this.totalPromotion = (0, exports.conversionDecimal)(order.totalPromotion);
        this.netPrice = (0, exports.conversionDecimal)(order.netPrice);
        this.addedTax = (0, exports.conversionDecimal)((0, exports.GenerateOrderPrice)(this.netPrice).addedTax);
        this.excise_tax = (0, exports.conversionDecimal)((0, exports.GenerateOrderPrice)(this.netPrice).exciseTax);
        /** Calculate the default price from the total price */
        this.grossPrice = (0, exports.conversionDecimal)((0, exports.GenerateOrderPrice)(
        // Calculate grossPrice Price
        this.netPrice).grossPrice);
        this.remarks = order.remarks;
        this.status = order.status || 1;
        this.customer_id = order.customer_id;
        this.payment_via = order.payment_via;
        this.approved_by = order.approved_by;
        this.modified_at = new Date();
    }
    create() {
        const _sql = `INSERT INTO orders (orderId, total_promotion, net_price, add_tax, excise_tax, gross_price, remarks, status, customer_id,
                   payment_via, approved_by, created_at, modified_at)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
        const result = DataBase_1.default.query(_sql, [
            this.orderId,
            this.totalPromotion,
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
    static save(payload) {
        const sql = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`;
        return DataBase_1.default.query(sql, [payload.status, payload.id]);
    }
    static findByCustomerAndStatus() {
        const sql = `SELECT O.id, O.gross_price, O.approved_by, C.first_name, C.last_name, OS.name FROM orders as O
                 INNER JOIN customers as C ON O.customer_id = C.id
                 INNER JOIN order_status as OS ON O.status = OS.id                 
                 `;
        return DataBase_1.default.query(sql);
    }
}
exports.CreateOrderType = CreateOrderType;
class CreateOrderItem {
    constructor(order) {
        this.order_id = order.order_id;
        this.product_id = order.product_id;
        this.promotion = order.qty_promotion;
        this.quantity = order.qty || 1;
    }
    create() {
        const _sql = `INSERT INTO order_items (order_id, product_id, promotion, quantity)
                  VALUES($1, $2, $3, $4) RETURNING *`;
        const result = DataBase_1.default.query(_sql, [
            this.order_id,
            this.product_id,
            this.promotion,
            this.quantity,
        ]);
        return result;
    }
    static findByOrderId(payload) {
        const sql = `SELECT * FROM order_items INNER JOIN orders on order_items.order_id = orders.id WHERE order_id = $1`;
        return DataBase_1.default.query(sql, [payload.id]);
    }
}
exports.CreateOrderItem = CreateOrderItem;
class CreateReportItem {
    constructor(order) {
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
        const result = DataBase_1.default.query(_sql, [
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
exports.CreateReportItem = CreateReportItem;
class OrderNotification {
    constructor(orderNotification) {
        this.created_at = new Date();
        this.message = orderNotification.message;
        this.header = orderNotification.header;
        // this.isRead = false;
        this.type = orderNotification.type;
        this.receiver_id = orderNotification.receiver_id;
        this.link_url = orderNotification.link_url;
        this.status = orderNotification.status || 1;
        this.modified_at = new Date();
    }
    create() {
        const _sql = `INSERT INTO notifications (message, header, type, _receiver_id, status, created_at, link_url, modified_at)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const result = DataBase_1.default.query(_sql, [
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
exports.OrderNotification = OrderNotification;
// Helpers
const GenerateOrderPrice = (netPrice) => {
    const orderPrice = {
        netPrice: netPrice,
        exciseTax: (dto_1.EXCISE_PERCENT * netPrice + netPrice),
        addedTax: (dto_1.VAT_PERCENT * (dto_1.EXCISE_PERCENT * netPrice + netPrice)),
    };
    orderPrice.grossPrice = orderPrice.exciseTax + orderPrice.addedTax;
    // (orderPrice.exciseTax + netPrice);
    return orderPrice;
};
exports.GenerateOrderPrice = GenerateOrderPrice;
const conversionDecimal = (numeric) => {
    // const orderPrice: OrderPrice = {
    //   netPrice: netPrice,
    //   exciseTax: (EXCISE_PERCENT * netPrice + netPrice) as number,
    //   addedTax: (VAT_PERCENT * (EXCISE_PERCENT * netPrice + netPrice)) as number,
    // };
    return Number(numeric === null || numeric === void 0 ? void 0 : numeric.toFixed(2));
    // orderPrice.grossPrice = orderPrice.exciseTax + orderPrice.addedTax;
    // (orderPrice.exciseTax + netPrice);
    // return orderPrice;
};
exports.conversionDecimal = conversionDecimal;
