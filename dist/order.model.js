"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOrderPrice = exports.OrderNotification = exports.OrderType = exports.OrderReceiverType = exports.OrderPaymentType = exports.OrderStatusState = exports.ORDER_NOTIFICATION_COLLECTION = exports.ORDER_COLLECTION = exports.VAT_PERCENT = void 0;
const firebase_1 = __importDefault(require("firebase"));
/** Constants */
exports.VAT_PERCENT = 0.2;
/** FIREBASE Collection names */
exports.ORDER_COLLECTION = "orders";
exports.ORDER_NOTIFICATION_COLLECTION = "orderNotifications";
var OrderStatusState;
(function (OrderStatusState) {
    OrderStatusState["PENDING"] = "pending";
    OrderStatusState["ACCEPTED"] = "accepted";
    OrderStatusState["DELIVERED"] = "delivered";
    OrderStatusState["CANCLED"] = "cancled";
})(OrderStatusState = exports.OrderStatusState || (exports.OrderStatusState = {}));
var OrderPaymentType;
(function (OrderPaymentType) {
    OrderPaymentType["STRIPE"] = "stripe";
})(OrderPaymentType = exports.OrderPaymentType || (exports.OrderPaymentType = {}));
var OrderReceiverType;
(function (OrderReceiverType) {
    OrderReceiverType["BUYER"] = "buyer";
    OrderReceiverType["SELLER"] = "seller";
})(OrderReceiverType = exports.OrderReceiverType || (exports.OrderReceiverType = {}));
class OrderType {
    constructor(order) {
        var _a;
        this.orderDate = firebase_1.default.firestore.Timestamp.now();
        this.id = order.id;
        this.orderNumber = order.orderNumber;
        this.buyer = order.buyer;
        this.seller = order.seller;
        // this.deliveryDate = order.deliveryDate
        this.product = order.product;
        // this.location = order.location
        this.paymentType = order.paymentType;
        this.sellerId = (_a = order.seller) === null || _a === void 0 ? void 0 : _a.id;
        this.orderDate = order.orderDate;
        this.status = order.status || OrderStatusState.PENDING;
        this.status = order.status || OrderStatusState.PENDING;
        this.actualCarbonReductionPrice =
            order.product.product.carbonReduction * order.product.quantity;
        /** Calculate the default price from the total price */
        this.price = (0, exports.GenerateOrderPrice)(
        // Calculate Net Price
        order.product.product.price * order.product.quantity, this.calculateCarbonReduction(order.product.product.carbonReduction * order.product.quantity));
        this.buyerId = order.buyerId;
    }
    getOrderDate() {
        if (!this.orderDate)
            throw new Error("Order doesn't have order date.");
        return this.orderDate.toDate();
    }
    getFormattedDate() {
        var _a;
        if (!this.orderDate)
            throw new Error("Order doesn't have order date.");
        return (_a = this.getOrderDate()) === null || _a === void 0 ? void 0 : _a.toLocaleString();
    }
    getActualCarbonReuctionPrice() {
        return this.actualCarbonReductionPrice;
    }
    calculateCarbonReduction(price) {
        return price - price * 0.01;
    }
    toJSON(withId = false) {
        var _a;
        const orderPrice = this.price;
        if (typeof orderPrice.grossPrice === "undefined")
            throw new Error("Order gross price shouldn't be undefined");
        const output = {
            status: (_a = this.status) === null || _a === void 0 ? void 0 : _a.toString(),
            orderDate: typeof this.orderDate === "undefined"
                ? new Date(Date.now())
                : this.orderDate,
            orderNumber: this.orderNumber,
            sellerId: this.sellerId,
            buyerId: this.buyerId,
            product: Object.assign({}, this.product),
            paymentType: this.paymentType,
            price: {
                carbonReduction: +orderPrice.carbonReduction,
                netPrice: +orderPrice.netPrice,
                addedTax: +orderPrice.addedTax,
                grossPrice: +orderPrice.grossPrice,
            },
            buyer: Object.assign({}, this.buyer),
            seller: Object.assign({}, this.seller),
        };
        return withId ? Object.assign({ id: this.id }, output) : output;
    }
}
exports.OrderType = OrderType;
class OrderNotification {
    constructor(orderNotification) {
        this.type = exports.ORDER_NOTIFICATION_COLLECTION;
        this.orderId = orderNotification.orderId;
        this.userId = orderNotification.userId;
        this.message = orderNotification.message;
        this.receiverId = orderNotification.userId;
        this.status = 1;
        this.content = orderNotification.message;
        this.receiverType = orderNotification.receiverType;
        this.dateTime = firebase_1.default.firestore.Timestamp.now();
        this.isRead = orderNotification.isRead || false;
    }
    getType() {
        return this.type;
    }
}
exports.OrderNotification = OrderNotification;
// Helpers
const GenerateOrderPrice = (netPrice, carbonReduction) => {
    const orderPrice = {
        netPrice,
        addedTax: exports.VAT_PERCENT * netPrice,
        carbonReduction,
    };
    orderPrice.grossPrice = orderPrice.addedTax + orderPrice.netPrice;
    return orderPrice;
};
exports.GenerateOrderPrice = GenerateOrderPrice;
