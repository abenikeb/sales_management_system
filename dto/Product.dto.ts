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

export interface ProductStatus {
  out_of_stock?: number;
  in_stock: number;
  running_low: boolean;
}

export interface ProductCategory {
  name: string;
  desc?: string;
  created_at?: Date;
  modified_at?: Date;
}

export class CreateProductInput {
  @IsNotEmpty()
  @Length(7, 15)
  name: string;

  @Length(6, 250)
  desc: string;

  @IsInt()
  @IsNotEmpty()
  category_id: number;

  @IsNotEmpty()
  product_image: string;

  @IsInt()
  inventory_id: number;

  @IsInt()
  @IsNotEmpty()
  SKU_id: number;

  @IsInt()
  @IsNotEmpty()
  status: number;

  @IsInt()
  @IsNotEmpty()
  tag_id: number;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  vender_id: number;
}

export interface ProductType {
  name: string;
  _desc: string;
  product_image?: string;
  product_images?: [string];
  category_id: number;
  inventory_id?: number;
  product_sku: number;
  price: number;
  status?: number;
  tag_id?: number;
  tag_id2?: number;
  tag_id3?: number;
  created_by: number;
  rating?: number;
  created_at: Date;
  modified_at?: Date;
}

export class CreateProductPrice {
  @IsNotEmpty()
  @Min(10)
  @Max(1000)
  price: number;

  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  user_categories_id: Number;
}

export class CreateProductPrmotion {
  @IsNotEmpty()
  @Min(10)
  @Max(1000)
  amount_price: number;

  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  user_categories_id: Number;
}
