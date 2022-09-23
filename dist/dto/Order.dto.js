"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderType = exports.OrderStatusState = exports.OrderInputs = exports.EXCISE_PERCENT = exports.VAT_PERCENT = void 0;
exports.VAT_PERCENT = 0.15;
exports.EXCISE_PERCENT = 0.1;
class OrderInputs {
}
exports.OrderInputs = OrderInputs;
var OrderStatusState;
(function (OrderStatusState) {
    OrderStatusState["PENDING"] = "pending";
    OrderStatusState["ACCEPTED"] = "checked";
    OrderStatusState["DELIVERED"] = "verified";
    OrderStatusState["CANCLED"] = "cancled";
})(OrderStatusState = exports.OrderStatusState || (exports.OrderStatusState = {}));
class CreateOrderType {
    constructor() {
        this.created_at = new Date();
    }
}
exports.CreateOrderType = CreateOrderType;
