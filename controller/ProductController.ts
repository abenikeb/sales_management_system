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
  CreateProductPrmotion,
  CreateProductPrice,
} from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import {
  Product,
  ProductPrice,
  ProductPromotion,
  UserCategory,
} from "../model";
import { FindUser } from "./UserController";

/*
 * PRODUCT SECTION
 */
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

  const existProduct = await Product.findOne({ _sku: Number(product_sku) });
  if (existProduct.rows[0])
    return res.status(401).send("Product alerady registerd!");

  const productCreate = new Product({
    _desc: _desc,
    product_images: imageCollections,
    product_sku: Number(product_sku),
    created_by: user.id,
    rating: 0,
    modified_at: new Date(),
  } as ProductType);

  const result = await productCreate.create();
  if (!result.rows[0]) return res.send("Error found when posting a product");

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

  const listProduct = await Product.find();
  if (!listProduct.rows) return res.json({ Message: "No Product Found!" });

  return res.json(listProduct.rows);
};

export const GetProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.query.id as any;

  const listProduct = await Product.findById({ id: productId });
  if (!listProduct.rows[0])
    return res
      .status(404)
      .json({ Message: "No product found with the given Id!" });

  return res.json(listProduct.rows[0]);
};

export const GetAllProductsWithPriceAndCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listProduct = await Product.findByPriceAndCategory();
  if (!listProduct.rows) return res.json({ Message: "No Product Found!" });

  return res.send(
    listProduct.rows.map((list) => {
      return {
        product: {
          id: list.id,
          product_sku: list.product_sku,
          desc: list._desc,
          product_images: list.product_images,
          created_by: list.created_by,
        },
        price: list.price,
        usersCategory: list.name,
      };
    })
  );
};

// but it is includded in UserCategory --> controller --> GetProductWithPrice_ByCategoryId
export const GetProductWithPriceAndCategory_ById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.query.id as any;

  const listProduct = await Product.findByPriceAndCategoryByCategoryId({
    id: productId,
  });
  if (!listProduct.rows) return res.json({ Message: "No Product Found!" });

  return res.send(
    listProduct.rows.map((list) => {
      return {
        product: {
          product_sku: list.product_sku,
          desc: list._desc,
          product_images: list.product_images,
          created_by: list.created_by,
        },
        price: list.price,
        usersCategory: {
          id: list.id,
          name: list.name,
        },
      };
    })
  );
};

export const UpdateProduct = async (req: Request, res: Response) => {
  const productId = req.query.id as any;

  const { product_sku, _desc } = req.body;

  const productInfo = {
    product_sku,
    _desc,
    modified_at: new Date(),
  };

  const result = await Product.save({
    info: productInfo,
    id: productId,
  });

  if (!result.rows[0])
    return res
      .status(404)
      .json({ message: "Unable to find the product with the given id" });

  return res.json({
    result: result.rows[0],
  });
};

export const RemoveProduct = async (req: Request, res: Response) => {
  const categoryId = req.params.id as any;

  const result = await Product.findByIdAndRemove({
    id: categoryId,
  });

  if (!result.rows[0])
    return res
      .status(404)
      .send("The users category with the given Id doesnot exist!");

  res.send(result.rows[0]);
};

/*
 * PRODUCT PRICE SECTION
 */

export const AddProductPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const CreateProductPrices = plainToClass(CreateProductPrice, req.body);
  const CreateProductPricesError = await validate(CreateProductPrices, {
    validationError: { target: true },
  });
  if (CreateProductPricesError.length > 0)
    return res.json(
      _.map(CreateProductPricesError, (error: any) => error.constraints)
    );

  const { product_id, user_categories_id, price } =
    req.body as CreateProductPrice;

  // const existOne = await ProductPrice.findOne({
  //   product_id: product_id,
  //   category_id: user_categories_id,
  // });
  // if (existOne)
  //   return res.status(400).json({
  //     error:
  //       "The price of the product has already been set for the specified user categories id..",
  //   });

  const product = await Product.findById({ id: product_id });
  if (!product.rows[0])
    return res.status(400).json({ error: "Invalid Product." });

  const userCategory = await UserCategory.findById({
    id: user_categories_id as number,
  });
  if (!userCategory.rows[0])
    return res.status(400).json({ error: "Invalid user Category." });

  const productCreate = new ProductPrice({
    product_id,
    user_categories_id,
    price,
  } as CreateProductPrice);

  const result = await productCreate.create();
  if (!result.rows[0]) return res.send({ error: "Error Found!" });

  res.status(200).send(result.rows[0]);
};

/*
 * PRODUCT PRICE PROMOTION
 */

export const AddProductPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const CreateProductPrmotions = plainToClass(CreateProductPrmotion, req.body);
  const CreateProductPrmotionsError = await validate(CreateProductPrmotions, {
    validationError: { target: true },
  });
  if (CreateProductPrmotionsError.length > 0)
    return res.json(
      _.map(CreateProductPrmotionsError, (error: any) => error.constraints)
    );

  const { product_id, user_categories_id, amount_price } =
    req.body as CreateProductPrmotion;

  const product = await Product.findById({ id: product_id });
  if (!product.rows[0])
    return res.status(400).json({ error: "Invalid Product." });

  const userCategory = await UserCategory.findById({
    id: user_categories_id as any,
  });
  if (!userCategory.rows[0])
    return res.status(400).json({ error: "Invalid user Category." });

  const productCreate = new ProductPromotion({
    product_id,
    user_categories_id,
    amount_price,
  } as CreateProductPrmotion);

  const result = await productCreate.create();
  res.status(200).send(result.rows[0]);
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
