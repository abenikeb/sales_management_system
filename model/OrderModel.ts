import { OrderPrice, OrderType, VAT_PERCENT, EXCISE_PERCENT } from "../dto";

export class CreateOrderType {
  netPrice: number;
  addedTax?: number;
  excise_tax?: number;
  grossPrice?: number;
  remarks?: string;
  user_id: string;
  status: number;
  vender_id: number;
  approved_by: string;
  payment_via?: string;
  delivery_boy?: number;
  created_at: Date = new Date();
  modified_at?: Date;

  constructor(order: OrderType) {
    this.netPrice = order.netPrice;
    this.addedTax = order.addedTax;
    this.user_id = order.user_id;
    this.vender_id = order.vender_id;
    this.payment_via = order.payment_via;
    this.delivery_boy = order.delivery_boy;
    this.modified_at = order.modified_at;

    this.status = order.status || 1;
    /** Calculate the default price from the total price */
    this.grossPrice = GenerateOrderPrice(
      // Calculate Net Price
      this.netPrice
    ).grossPrice;
    this.remarks = order.remarks;
  }
}

export class OrderNotification {
  id?: string;
  orderId: string;
  userId: string;
  message: string;
  isRead?: boolean;
  type?: Readonly<string> = ORDER_NOTIFICATION_COLLECTION;
  receiverId?: string;
  status?: number;
  content?: string;
  receiverType: OrderReceiverType;
  dateTime?: firebase.firestore.Timestamp;

  constructor(orderNotification: OrderNotification) {
    this.orderId = orderNotification.orderId;
    this.userId = orderNotification.userId;
    this.message = orderNotification.message;
    this.receiverId = orderNotification.userId;
    this.status = 1;
    this.content = orderNotification.message;
    this.receiverType = orderNotification.receiverType;
    this.dateTime = new Date();

    this.isRead = orderNotification.isRead || false;
  }
}
// Helpers
export const GenerateOrderPrice = (netPrice: number): OrderPrice => {
  const orderPrice: OrderPrice = {
    netPrice,
    addedTax: VAT_PERCENT * netPrice,
    exciseTax: EXCISE_PERCENT,
  };

  orderPrice.grossPrice = orderPrice.addedTax + orderPrice.netPrice;

  return orderPrice;
};
