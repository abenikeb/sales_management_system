"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductPromotion = exports.AddProductPrice = exports.RemoveProduct = exports.UpdateProduct = exports.GetProductWithPriceAndCategory_ById = exports.GetAllProductsWithPriceAndCategory = exports.GetProductById = exports.GetProducts = exports.AddProduct = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const lodash_1 = __importDefault(require("lodash"));
const dto_1 = require("../dto");
const model_1 = require("../model");
/*
 * PRODUCT SECTION
 */
const AddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    const imageCollections = [];
    const files = req.files;
    const images = files.map((file) => file.filename);
    lodash_1.default.forEach(files, (uploadIage) => imageCollections.push(uploadIage.filename));
    // const CreateProductInputs = plainToClass(CreateProductInput, req.body);
    // const CreateProductInputsError = await validate(CreateProductInputs, {
    //   validationError: { target: true },
    // });
    // if (CreateProductInputsError.length > 0)
    //   return res.json(CreateProductInputsError);
    const { product_sku, _desc } = req.body;
    const existProduct = yield model_1.Product.findOne({ _sku: Number(product_sku) });
    if (existProduct.rows[0])
        return res.status(401).send("Product alerady registerd!");
    const productCreate = new model_1.Product({
        _desc: _desc,
        product_images: imageCollections,
        product_sku: Number(product_sku),
        created_by: user.id,
        rating: 0,
        modified_at: new Date(),
    });
    const result = yield productCreate.create();
    if (!result.rows[0])
        return res.send("Error found when posting a product");
    res.status(200).send(result.rows[0]);
});
exports.AddProduct = AddProduct;
const GetProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    const listProduct = yield model_1.Product.find();
    if (!listProduct.rows)
        return res.json({ Message: "No Product Found!" });
    return res.json(listProduct.rows);
});
exports.GetProducts = GetProducts;
const GetProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.query.id;
    const listProduct = yield model_1.Product.findById({ id: productId });
    if (!listProduct.rows[0])
        return res
            .status(404)
            .json({ Message: "No product found with the given Id!" });
    return res.json(listProduct.rows[0]);
});
exports.GetProductById = GetProductById;
const GetAllProductsWithPriceAndCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const listProduct = yield model_1.Product.findByPriceAndCategory();
    if (!listProduct.rows)
        return res.json({ Message: "No Product Found!" });
    return res.send(listProduct.rows.map((list) => {
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
    }));
});
exports.GetAllProductsWithPriceAndCategory = GetAllProductsWithPriceAndCategory;
// but it is includded were also in UserCategory --> controller --> GetProductWithPrice_ByCategoryId
const GetProductWithPriceAndCategory_ById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.query.id;
    const listProduct = yield model_1.Product.findByPriceAndCategoryByCategoryId({
        id: productId,
    });
    if (!listProduct.rows)
        return res.json({ Message: "No Product Found!" });
    return res.send(listProduct.rows.map((list) => {
        return {
            product: {
                id: list.id2,
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
    }));
});
exports.GetProductWithPriceAndCategory_ById = GetProductWithPriceAndCategory_ById;
const UpdateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.query.id;
    const { product_sku, _desc } = req.body;
    const productInfo = {
        product_sku,
        _desc,
        modified_at: new Date(),
    };
    const result = yield model_1.Product.save({
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
});
exports.UpdateProduct = UpdateProduct;
const RemoveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const result = yield model_1.Product.findByIdAndRemove({
        id: categoryId,
    });
    if (!result.rows[0])
        return res
            .status(404)
            .send("The users category with the given Id doesnot exist!");
    res.send(result.rows[0]);
});
exports.RemoveProduct = RemoveProduct;
/*
 * PRODUCT PRICE SECTION
 */
const AddProductPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CreateProductPrices = (0, class_transformer_1.plainToClass)(dto_1.CreateProductPrice, req.body);
    const CreateProductPricesError = yield (0, class_validator_1.validate)(CreateProductPrices, {
        validationError: { target: true },
    });
    if (CreateProductPricesError.length > 0)
        return res.json(lodash_1.default.map(CreateProductPricesError, (error) => error.constraints));
    const { product_id, user_categories_id, price } = req.body;
    // const existOne = await ProductPrice.findOne({
    //   product_id: product_id,
    //   category_id: user_categories_id,
    // });
    // if (existOne)
    //   return res.status(400).json({
    //     error:
    //       "The price of the product has already been set for the specified user categories id..",
    //   });
    const product = yield model_1.Product.findById({ id: product_id });
    if (!product.rows[0])
        return res.status(400).json({ error: "Invalid Product." });
    const userCategory = yield model_1.UserCategory.findById({
        id: user_categories_id,
    });
    if (!userCategory.rows[0])
        return res.status(400).json({ error: "Invalid user Category." });
    const productCreate = new model_1.ProductPrice({
        product_id,
        user_categories_id,
        price,
    });
    const result = yield productCreate.create();
    if (!result.rows[0])
        return res.send({ error: "Error Found!" });
    res.status(200).send(result.rows[0]);
});
exports.AddProductPrice = AddProductPrice;
/*
 * PRODUCT PRICE PROMOTION
 */
const AddProductPromotion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CreateProductPrmotions = (0, class_transformer_1.plainToClass)(dto_1.CreateProductPrmotion, req.body);
    const CreateProductPrmotionsError = yield (0, class_validator_1.validate)(CreateProductPrmotions, {
        validationError: { target: true },
    });
    if (CreateProductPrmotionsError.length > 0)
        return res.json(lodash_1.default.map(CreateProductPrmotionsError, (error) => error.constraints));
    const { product_id, user_categories_id, amount_price } = req.body;
    const product = yield model_1.Product.findById({ id: product_id });
    if (!product.rows[0])
        return res.status(400).json({ error: "Invalid Product." });
    const userCategory = yield model_1.UserCategory.findById({
        id: user_categories_id,
    });
    if (!userCategory.rows[0])
        return res.status(400).json({ error: "Invalid user Category." });
    const productCreate = new model_1.ProductPromotion({
        product_id,
        user_categories_id,
        amount_price,
    });
    const result = yield productCreate.create();
    res.status(200).send(result.rows[0]);
});
exports.AddProductPromotion = AddProductPromotion;
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
