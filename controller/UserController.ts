import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";

import _ from "lodash";

import {
  UserPayload,
  CreateUserType,
  CreateUserLogin,
  EditProfile,
  UserType,
  CreateVendorInput,
  CreateCustomerInput,
} from "../dto";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
  GenerateSalt,
  onRequestOtp,
} from "../utility";
import {} from "./../utility/PasswordUnility";
import { Customer, User } from "../model";

/*
 * User section
 */

export const FindUser = (id: number, tel?: string) => {
  if (tel) return User.findOne({ tel: tel });
  else return User.findById({ id: id });
};

export const UserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInputs = plainToClass(CreateUserType, req.body);
  const userInputErrors = await validate(userInputs, {
    validationError: { target: true },
  });
  if (userInputErrors.length > 0) {
    return res.status(400).json(userInputErrors);
  }

  const { tel, password, user_name, user_group } = userInputs;

  const existCustomer = await User.findOne({ tel: tel });
  if (existCustomer.rows.length > 0)
    return res.status(400).json({ message: "User already registered." });
  // return res.json({ existCustomer: existCustomer.rows.length });

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOtp();

  const user = new User({
    tel: tel,
    password: userPassword,
    first_name: "",
    last_name: "",
    user_name: user_name,
    email: "",
    verified: false,
    salt: salt,
    otp: otp,
    otp_expiry: expiry,
    modified_at: new Date(),
    user_group: user_group,
  } as any);

  const result = await user.create();
  if (!result) return res.status(400).send("Error Found!");

  // // send otp to customer
  // await onRequestOtp(otp, tel);

  // generate signture
  const signture = GenerateSignature({
    id: result.rows[0].id,
    tel: result.rows[0].tel,
    user_name: result.rows[0].user_name,
    verified: result.rows[0].verified,
    user_group: result.rows[0].user_group,
  } as UserPayload);

  return res
    .header("x-auth-token", signture)
    .header("access-control-expose-headers", "x-auth-token")
    .json({
      signture: signture,
      otp: otp,
      verified: result.rows[0].verified,
      tel: result.rows[0].tel,
    });
};

export const UserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInputs = plainToClass(CreateUserLogin, req.body);
  const userInputErrors = await validate(userInputs, {
    validationError: { target: true },
  });
  if (userInputErrors.length > 0) {
    return res.status(400).json(userInputErrors);
  }

  const { tel, password } = userInputs;

  const existUser = await User.findOne({ tel: tel });
  if (!existUser) return res.status(400).json("Invalid phone no or password");

  const validPassword = await ValidatePassword(
    password,
    existUser.rows[0].password,
    existUser.rows[0].salt
  );

  if (!validPassword) return res.status(400).json("Invalid email or password");

  const signture = GenerateSignature({
    id: existUser.rows[0].id,
    tel: existUser.rows[0].tel,
    user_name: existUser.rows[0].user_name,
    verified: existUser.rows[0].verified,
    user_group: existUser.rows[0].user_group,
  } as UserPayload);
  res.status(200).json(signture);
};

// export const UserVerify = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { otp } = <UserType>req.body;
//   const user = <UserPayload>req.user;

//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const profile = await User.findById(user.id);
//   if (!profile) return;

//   if (profile.otp === otp && profile.otp_expiry >= new Date()) {
//     profile.verified = true;

//     const updateUserResponse = await profile.save();

//     const signture = GenerateSignature({
//       id: updateUserResponse.id,
//       tel: updateUserResponse.email,
//     });

//     res.status(201).json({
//       signture: signture,
//       verified: updateUserResponse.verified,
//       tel: updateUserResponse.tel,
//     });
//   }
// };

// export const RequestOtp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.user;
//   if (!user) return;

//   const profile = await User.findById(user.id);
//   if (!profile) return;

//   const { otp, expiry } = GenerateOtp();
//   profile.otp = otp;
//   profile.otp_expiry = expiry;

//   await profile.save();
//   await onRequestOtp(otp, profile.tel);

//   res.status(200).json({ message: "OTP is Sent via Your Phone" });
// };

export const GetUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let profile = await User.findById({ id: user.id });
  if (!profile) return res.status(400).json({ message: "Invalid profile!" });

  return res.status(200).json(profile.rows[0]);
};

export const EditUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const userInputs = plainToClass(EditProfile, req.body);
  const inputErrors = await validate(userInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { first_name, last_name, email } = <UserType>userInputs;

  let profile = (await User.findById({ id: user.id })) as any;
  if (!profile) return res.status(400).json({ message: "Invalid User!" });

  profile = profile.rows[0];

  profile.first_name = first_name;
  profile.last_name = last_name;
  profile.email = email;

  const result = await User.save(profile);

  res.json(
    _.pick(result.rows[0], [
      "id",
      "first_name",
      "last_name",
      "email",
      "tel",
      "user_group",
    ])
  );
};

/*
 * Customer section
 */

export const CreateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const vendorInput = plainToClass(CreateCustomerInput, req.body);
  const vendorInputErrors = await validate(vendorInput, {
    validationError: { target: true },
  });
  if (vendorInputErrors.length > 0) {
    return res
      .status(400)
      .json(_.map(vendorInputErrors, (error: any) => error.constraints));
  }

  const {
    first_name,
    last_name,
    category_id,
    business_licenses_no,
    plate_no,
    type_id,
    territory,
    email,
    tel,
    city,
  } = vendorInput;

  const existCustomer = await Customer.findOne({ tel: tel });
  if (existCustomer.rows.length > 0)
    return res.status(400).json({ message: "Customer already registered." });

  const customer = await new Customer({
    first_name,
    last_name,
    category_id,
    business_licenses_no,
    plate_no,
    type_id,
    territory,
    email,
    tel,
    lat: 0,
    lng: 0,
    approved_by: user.id,
    city,
    modified_at: new Date(),
  } as CreateCustomerInput);

  const result = await customer.create();
  if (!result) return res.json({ message: "Error found" });

  // generate signture
  const signture = GenerateSignature({
    id: result.rows[0].id,
    email: result.rows[0].email,
    name: result.rows[0].name,
  } as UserPayload);

  return res
    .header("x-auth-token", signture)
    .header("access-control-expose-headers", "x-auth-token")
    .json({
      signture: signture,
      name: result.rows[0].name,
      email: result.rows[0].email,
    });
};

export const GetCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = await Customer.find();
  if (!customer)
    return res.status(404).json("Message: Customer does not exist");
  return res.json(customer.rows);
};

export const GetCustomerByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = await Customer.findById({ id: req.params.id });
  if (customer != null) return res.status(200).json(customer.rows[0]);
  return res.status(404).json({ Message: "With this id, there is no vendor." });
};
