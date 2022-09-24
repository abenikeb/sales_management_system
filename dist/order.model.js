"use strict";
// // import firebase from "firebase";
// import { ProductType } from "./products.model";
// /** Constants */
// export const VAT_PERCENT = 0.2;
// /** FIREBASE Collection names */
// export const ORDER_COLLECTION = "orders";
// export const ORDER_NOTIFICATION_COLLECTION = "orderNotifications";
// export interface UserType {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
// }
// export enum OrderStatusState {
//   PENDING = "pending",
//   ACCEPTED = "accepted",
//   DELIVERED = "delivered",
//   CANCLED = "cancled",
// }
// export enum OrderPaymentType {
//   STRIPE = "stripe",
// }
// export enum OrderReceiverType {
//   BUYER = "buyer",
//   SELLER = "seller",
// }
// export interface OrderProduct {
//   product: ProductType;
//   quantity: number;
// }
// export interface OrderPrice {
//   carbonReduction: number;
//   netPrice: number;
//   addedTax: number;
//   grossPrice?: number;
// }
// export class OrderType {
//   id?: string;
//   orderNumber: number;
//   status?: OrderStatusState;
//   orderDate?: firebase.firestore.Timestamp = firebase.firestore.Timestamp.now();
//   sellerId?: string;
//   buyerId?: string;
//   product: OrderProduct;
//   paymentType: OrderPaymentType;
//   price?: OrderPrice;
//   buyer?: UserType;
//   seller?: UserType;
//   private actualCarbonReductionPrice: number;
//   constructor(order: OrderType) {
//     this.id = order.id;
//     this.orderNumber = order.orderNumber;
//     this.buyer = order.buyer;
//     this.seller = order.seller;
//     // this.deliveryDate = order.deliveryDate
//     this.product = order.product;
//     // this.location = order.location
//     this.paymentType = order.paymentType;
//     this.sellerId = order.seller?.id;
//     this.orderDate = order.orderDate;
//     this.status = order.status || OrderStatusState.PENDING;
//     this.status = order.status || OrderStatusState.PENDING;
//     this.actualCarbonReductionPrice =
//       order.product.product.carbonReduction * order.product.quantity;
//     /** Calculate the default price from the total price */
//     this.price = GenerateOrderPrice(
//       // Calculate Net Price
//       order.product.product.price * order.product.quantity,
//       this.calculateCarbonReduction(
//         order.product.product.carbonReduction * order.product.quantity
//       )
//     );
//     this.buyerId = order.buyerId;
//   }
//   getOrderDate(): Date | undefined {
//     if (!this.orderDate) throw new Error("Order doesn't have order date.");
//     return this.orderDate.toDate();
//   }
//   getFormattedDate(): string | undefined {
//     if (!this.orderDate) throw new Error("Order doesn't have order date.");
//     return this.getOrderDate()?.toLocaleString();
//   }
//   getActualCarbonReuctionPrice() {
//     return this.actualCarbonReductionPrice;
//   }
//   private calculateCarbonReduction(price: number) {
//     return price - price * 0.01;
//   }
//   toJSON(withId: boolean = false): object {
//     const orderPrice = this.price as OrderPrice;
//     if (typeof orderPrice.grossPrice === "undefined")
//       throw new Error("Order gross price shouldn't be undefined");
//     const output = {
//       status: this.status?.toString(),
//       orderDate:
//         typeof this.orderDate === "undefined"
//           ? new Date(Date.now())
//           : this.orderDate,
//       orderNumber: this.orderNumber,
//       sellerId: this.sellerId,
//       buyerId: this.buyerId,
//       product: { ...this.product },
//       paymentType: this.paymentType,
//       price: {
//         carbonReduction: +orderPrice.carbonReduction,
//         netPrice: +orderPrice.netPrice,
//         addedTax: +orderPrice.addedTax,
//         grossPrice: +orderPrice.grossPrice,
//       },
//       buyer: { ...this.buyer },
//       seller: { ...this.seller },
//     };
//     return withId ? { id: this.id, ...output } : output;
//   }
// }
// export interface OrderState {
//   orderNotifications?: Array<any>;
//   orders?: Array<OrderType>;
// }
// export class OrderNotification {
//   id?: string;
//   orderId: string;
//   userId: string;
//   message: string;
//   isRead?: boolean;
//   type?: Readonly<string> = ORDER_NOTIFICATION_COLLECTION;
//   receiverId?: string;
//   status?: number;
//   content?: string;
//   receiverType: OrderReceiverType;
//   dateTime?: firebase.firestore.Timestamp;
//   constructor(orderNotification: OrderNotification) {
//     this.orderId = orderNotification.orderId;
//     this.userId = orderNotification.userId;
//     this.message = orderNotification.message;
//     this.receiverId = orderNotification.userId;
//     this.status = 1;
//     this.content = orderNotification.message;
//     this.receiverType = orderNotification.receiverType;
//     this.dateTime = firebase.firestore.Timestamp.now();
//     this.isRead = orderNotification.isRead || false;
//   }
//   getType?() {
//     return this.type;
//   }
// }
// // Helpers
// export const GenerateOrderPrice = (
//   netPrice: number,
//   carbonReduction: number
// ): OrderPrice => {
//   const orderPrice: OrderPrice = {
//     netPrice,
//     addedTax: VAT_PERCENT * netPrice,
//     carbonReduction,
//   };
//   orderPrice.grossPrice = orderPrice.addedTax + orderPrice.netPrice;
//   return orderPrice;
// };
