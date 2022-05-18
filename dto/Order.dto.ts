import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from "class-validator";

export const VAT_PERCENT = 0.15;
export const EXCISE_PERCENT = 0.1;

export interface ProductItems {
  product_id: number;
  promotion: number;
  quantity: number;
}

export class OrderInputs {
  trnxId: string;
  amount: number;
  customer_id: number;
  user_categories_id: number;
  remarks: string;
  items: [ProductItems];
}

export enum OrderStatusState {
  PENDING = "pending",
  ACCEPTED = "checked",
  DELIVERED = "verified",
  CANCLED = "cancled",
}

export interface OrderItems {
  order_id: number;
  product_id: number;
  quantity: number;
  is_promotion: boolean;
}

export interface OrderPrice {
  netPrice: number;
  addedTax: number;
  exciseTax: number;
  grossPrice?: number;
}

export class CreateOrderType {
  netPrice: number;
  addedTax?: number;
  excise_tax?: number;
  grossPrice?: number;
  remarks: string;
  customer_id: string;
  status: number;
  approved_by: string;
  payment_via?: string;
  created_at: Date = new Date();
  modified_at?: Date;
}

export interface OrderType {
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
  created_at: Date;
  modified_at?: Date;
}
