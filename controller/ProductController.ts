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

// export const GetProducts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user as UserPayload;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const listProduct = await Grocery.find({ vandorId: user.id });
//   if (!listProduct) return res.json({ Message: "No Product Found!" });

//   return res.json(listProduct);
// };

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
