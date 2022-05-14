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

export class CreateUserType {
  @IsNotEmpty()
  @Length(7, 15)
  tel: string;

  @Length(6, 50)
  password: string;

  @IsInt()
  user_group?: number;
}

export class EditProfile {
  @IsString()
  @Length(5, 50)
  first_name: string;

  @IsString()
  @Length(2, 50)
  last_name: string;

  @IsEmail()
  email: string;
}

export class CreateUserLogin {
  @IsNotEmpty()
  @Length(7, 15)
  tel: string;

  @Length(6, 50)
  password: string;
}

export interface UserType {
  id: number;
  tel: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  verified?: boolean;
  salt?: string;
  otp: string;
  otp_expiry?: Date;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  lat?: number;
  lng?: number;
  created_at?: Date;
  modified_at?: Date;
  user_group: number;
}

export interface UserPayload {
  id: number;
  tel: string;
  email: string;
  name: string;
  verified?: boolean;
  user_group: number;
}
