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
import { Product, ProductPrice, ProductPromotion } from "../model";
import { FindUser } from "./UserController";

export const AddProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existUser = await FindUser(user.id);
  if (!existUser) return res.status(400).json({ message: "Invalid User!" });

  const imageCollections = [] as Array<string>;
  const files = req.files as [Express.Multer.File];
  const images = files.map((file: Express.Multer.File) => file.filename);
  _.forEach(files, (uploadIage) => imageCollections.push(uploadIage.filename));

  // const CreateProductInputs = plainToClass(CreateProductInput, req.body);
  // const CreateProductInputsError = await validate(CreateProductInputs, {
  //   validationError: { target: true },
  // });
  // if (CreateProductInputsError.length > 0)
  //   return res.json(CreateProductInputsError);

  const { product_sku, _desc } = req.body as any;

  const productCreate = new Product({
    _desc: _desc,
    product_images: imageCollections,
    product_sku: Number(product_sku),
    created_by: existUser.rows[0].id,
    rating: 0,
    modified_at: new Date(),
  } as ProductType);

  const result = await productCreate.create();
  res.status(200).send(result.rows[0]);
};

export const AddProductPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existUser = await FindUser(user.id);
  if (!existUser) return res.status(400).json({ message: "Invalid User!" });

  // const CreateProductInputs = plainToClass(CreateProductInput, req.body);
  // const CreateProductInputsError = await validate(CreateProductInputs, {
  //   validationError: { target: true },
  // });
  // if (CreateProductInputsError.length > 0)
  //   return res.json(CreateProductInputsError);

  const { product_id, user_categories_id, price } = req.body as any;

  const productCreate = new ProductPrice({
    product_id,
    user_categories_id,
    price,
  } as ProductPrice);

  const result = await productCreate.create();
  res.status(200).send(result.rows[0]);
};

export const AddProductPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let existUser = await FindUser(user.id);
  if (!existUser) return res.status(400).json({ message: "Invalid User!" });

  const { product_id, user_categories_id, amount_price } = req.body as any;

  const productCreate = new ProductPromotion({
    product_id,
    user_categories_id,
    amount_price,
  } as ProductPromotion);

  const result = await productCreate.create();
  res.status(200).send(result.rows[0]);
};

export const GetProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const listProduct = await Product.findByUserId({ userId: user.id });
  if (!listProduct) return res.json({ Message: "No Product Found!" });

  return res.json(listProduct.rows);
};

// export const GetOrdersVandor = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;
//   if (user) {
//     const vandorOrder = await Order.find({ vandorID: user._id }).populate(
//       "items.grocery"
//     );
//     if (vandorOrder) {
//       return res.json(vandorOrder);
//     }
//   }
//   return res.status(400).json("No Order Found");
// };

// export const GetOrdersDetail = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const order = await Order.findById(req.params.id).populate("items.grocery");

//   if (!order)
//     return res.status(404).send("The Order with the given ID was not found.");

//   res.status(200).json({ order });
// };

// export const ProcessOrder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { orderStatus } = req.body as any;

//   let order = await Order.findById(req.params.id).populate("items.grocery");
//   order.orderStatus = orderStatus;
//   await order.save();

//   if (!order)
//     return res
//       .status(404)
//       .json({ message: "The Order with the given ID was not found." });

//   res.status(200).json({ order: order });
// };

// export const UpdateVendorProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { name, address_line1, address_line2, email, tel, password } =
//     req.body as VendorType;

//   const user = req.user as UserPayload;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let existingVendor = (await FindVendor(user.id)) as any;
//   if (!existingVendor.rows[0])
//     return res.status(400).json({ message: "Invalid Vendor!" });

//   existingVendor = existingVendor.rows[0];

//   existingVendor.name = name;
//   existingVendor.address_line1 = address_line1;
//   existingVendor.address_line2 = address_line2;
//   existingVendor.email = email;
//   existingVendor.tel = tel;
//   existingVendor.password = password;

//   const result = await Vendor.save(existingVendor, existingVendor.id);

//   res.json(
//     _.pick(result.rows[0], [
//       "id",
//       "name",
//       "password",
//       "email",
//       "tel",
//       "address_line1",
//       "address_line2",
//     ])
//   );
// };

// export const UpdateVendorCoverImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user as UserPayload;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let existingVandor = await FindVendor(user.id);
//   if (!existingVandor)
//     return res.status(400).json({ message: "Invalid Vendor!" });

//   const files = req.files as [Express.Multer.File];
//   const images = files.map((file: Express.Multer.File) => file.filename);
//   existingVandor.rows[0].coverImages.push(...images);

//   await existingVandor.rows[0].save();
//   res.status(200).json({ result: existingVandor });
// };

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
