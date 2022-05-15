import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import _ from "lodash";

import {
  CreateProductInput,
  LoginVandor,
  UserType,
  UserPayload,
  CreateVendorInput,
  OrderStatusState,
  VendorPayLoad,
  VendorType,
  CreateVendorLogin,
  ProductType,
} from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVendor } from "../controller";
import { Vendor, Product } from "../model";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const CreateVendorInputs = plainToClass(CreateVendorLogin, req.body);
  const CreateVendorInputsError = await validate(CreateVendorInputs, {
    validationError: { target: true },
  });
  if (CreateVendorInputsError.length > 0)
    return res.json(
      _.map(CreateVendorInputsError, (error) => error.constraints)
    );

  const { email, password } = CreateVendorInputs;

  const existingVandor = await FindVendor("" as any, email);
  if (!existingVandor.rows[0])
    return res.status(400).json("Invalid email or password");

  const validation = await ValidatePassword(
    password,
    existingVandor.rows[0].password,
    existingVandor.rows[0].salt
  );
  if (!validation) return res.status(400).json("Invalid email or password");

  const signture = GenerateSignature({
    id: existingVandor.rows[0].id,
    email: existingVandor.rows[0].email,
    name: existingVandor.rows[0].name,
  } as UserPayload);

  return res.status(200).json(signture);
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let vendor = await FindVendor(user.id);
  if (!vendor) return res.status(400).json({ message: "Invalid Vendor!" });

  return res
    .status(200)
    .json(
      _.pick(vendor.rows[0], [
        "id",
        "name",
        "email",
        "tel",
        "password",
        "service_available",
        "rating",
        "address_line1",
        "address_line2",
        "city",
        "lat",
        "lng",
        "first_name",
        "last_name",
        "verified",
        "user_group",
      ])
    );
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address_line1, address_line2, email, tel, password } =
    req.body as VendorType;

  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existingVendor = (await FindVendor(user.id)) as any;
  if (!existingVendor.rows[0])
    return res.status(400).json({ message: "Invalid Vendor!" });

  existingVendor = existingVendor.rows[0];

  existingVendor.name = name;
  existingVendor.address_line1 = address_line1;
  existingVendor.address_line2 = address_line2;
  existingVendor.email = email;
  existingVendor.tel = tel;
  existingVendor.password = password;

  const result = await Vendor.save(existingVendor, existingVendor.id);

  res.json(
    _.pick(result.rows[0], [
      "id",
      "name",
      "password",
      "email",
      "tel",
      "address_line1",
      "address_line2",
    ])
  );
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existingVandor = await FindVendor(user.id);
  if (!existingVandor)
    return res.status(400).json({ message: "Invalid Vendor!" });

  const files = req.files as [Express.Multer.File];
  const images = files.map((file: Express.Multer.File) => file.filename);
  existingVandor.rows[0].coverImages.push(...images);

  await existingVandor.rows[0].save();
  res.status(200).json({ result: existingVandor });
};

// export const UpdateVendorService = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user as UserPayload;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let existingVendor = (await FindVendor(user.id)) as any;
//   if (!existingVendor)
//     return res.status(400).json({ message: "Invalid Vendor!" });

//   existingVendor = existingVendor.rows[0];
//   existingVendor.service_available = !existingVendor.service_available;

//   const { lat, lng } = req.body as UserType;
//   if (!(lat && lng))
//     return res.status(400).json({
//       message: "We were unable to locate the vendor's location.",
//     });

//   existingVendor.lat = lat;
//   existingVendor.lng = lng;

//   const result = await Vendor.saveSevice(existingVendor, existingVendor.id);
//   res.send(result.rows[0]);
// };
