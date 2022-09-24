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
exports.RemoveUsersCategory = exports.UpdateUserCategory = exports.GetProductWithPrice_ByCategoryId = exports.GetUserCategoryById = exports.GetUserCategories = exports.CreateUserCategory = exports.GetCustomerPaymentType = exports.DeleteCustomer = exports.UpdateCustomerProfile = exports.GetCustomerBySearch = exports.GetCustomersByUserCategory = exports.GetCustomerByID = exports.GetCustomers = exports.CreateCustomer = exports.EditUserProfile = exports.GetUserProfile = exports.UserLogin = exports.UserSignUp = exports.FindUser = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const lodash_1 = __importDefault(require("lodash"));
const dto_1 = require("../dto");
const utility_1 = require("../utility");
const model_1 = require("../model");
/*
 * USER SECTION
 */
const FindUser = (id, tel) => {
    if (tel)
        return model_1.User.findOne({ tel: tel });
    else
        return model_1.User.findById({ id: id });
};
exports.FindUser = FindUser;
const UserSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateUserType, req.body);
    const userInputErrors = yield (0, class_validator_1.validate)(userInputs, {
        validationError: { target: true },
    });
    if (userInputErrors.length > 0) {
        return res.status(400).json(userInputErrors);
    }
    const { tel, password, user_name, user_group } = userInputs;
    const existCustomer = yield model_1.User.findOne({ tel: tel });
    if (existCustomer.rows.length > 0)
        return res.status(400).json({ message: "User already registered." });
    // return res.json({ existCustomer: existCustomer.rows.length });
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const user = new model_1.User({
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
    });
    const result = yield user.create();
    if (!result)
        return res.status(400).send("Error Found!");
    // // send otp to customer
    // await onRequestOtp(otp, tel);
    // generate signture
    const signture = (0, utility_1.GenerateSignature)({
        id: result.rows[0].id,
        tel: result.rows[0].tel,
        user_name: result.rows[0].user_name,
        verified: result.rows[0].verified,
        user_group: result.rows[0].user_group,
    });
    return res
        .header("x-auth-token", signture)
        .header("access-control-expose-headers", "x-auth-token")
        .json({
        signture: signture,
        otp: otp,
        verified: result.rows[0].verified,
        tel: result.rows[0].tel,
    });
});
exports.UserSignUp = UserSignUp;
const UserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateUserLogin, req.body);
    const userInputErrors = yield (0, class_validator_1.validate)(userInputs, {
        validationError: { target: true },
    });
    if (userInputErrors.length > 0) {
        return res.status(400).json(userInputErrors);
    }
    const { tel, password } = userInputs;
    const existUser = yield model_1.User.findOne({ tel: tel });
    if (!existUser)
        return res.status(400).json({ message: "Invalid phone no or password" });
    const validPassword = yield (0, utility_1.ValidatePassword)(password, existUser.rows[0].password, existUser.rows[0].salt);
    if (!validPassword)
        return res.status(400).json({ message: "Invalid phone no or password" });
    const signture = (0, utility_1.GenerateSignature)({
        id: existUser.rows[0].id,
        tel: existUser.rows[0].tel,
        user_name: existUser.rows[0].user_name,
        verified: existUser.rows[0].verified,
        user_group: existUser.rows[0].user_group,
    });
    res.status(200).json({ token: signture, expiresIn: 3600 });
});
exports.UserLogin = UserLogin;
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
const GetUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    let profile = yield model_1.User.findById({ id: user.id });
    if (!profile)
        return res.status(400).json({ message: "Invalid profile!" });
    return res.status(200).json(profile.rows[0]);
});
exports.GetUserProfile = GetUserProfile;
const EditUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    const userInputs = (0, class_transformer_1.plainToClass)(dto_1.EditProfile, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(userInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { first_name, last_name, email } = userInputs;
    let profile = (yield model_1.User.findById({ id: user.id }));
    if (!profile)
        return res.status(400).json({ message: "Invalid User!" });
    profile = profile.rows[0];
    profile.first_name = first_name;
    profile.last_name = last_name;
    profile.email = email;
    const result = yield model_1.User.save(profile);
    res.json(lodash_1.default.pick(result.rows[0], [
        "id",
        "first_name",
        "last_name",
        "email",
        "tel",
        "user_group",
    ]));
});
exports.EditUserProfile = EditUserProfile;
/*
 * CUSTOMER SECTION
 */
const CreateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    const customerInput = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInput, req.body);
    const customerInputErrors = yield (0, class_validator_1.validate)(customerInput, {
        validationError: { target: true },
    });
    if (customerInputErrors.length > 0) {
        return res.status(400).json(lodash_1.default.map(customerInputErrors, (error) => {
            return { err: error.constraints, property: error.property };
        }));
    }
    const { first_name, last_name, category_id, business_licenses_no, plate_no, type_id, territory, email, tel, city, } = customerInput;
    const existCustomer = yield model_1.Customer.findOne({ tel: tel });
    if (existCustomer.rows.length > 0)
        return res.status(401).json({ message: "Customer already registered." });
    const customer = yield new model_1.Customer({
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
    });
    const result = yield customer.create();
    if (!result)
        return res.json({ message: "Error found" });
    // generate signture
    const signture = (0, utility_1.GenerateSignature)({
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
    });
    return res
        .header("x-auth-token", signture)
        .header("access-control-expose-headers", "x-auth-token")
        .json(result.rows[0]);
});
exports.CreateCustomer = CreateCustomer;
const GetCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield model_1.Customer.find();
    if (!customer.rows)
        return res.json({ message: "No Customer Registered!" });
    return res.json(customer.rows);
});
exports.GetCustomers = GetCustomers;
const GetCustomerByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield model_1.Customer.findById({ id: req.params.id });
    if (!customer.rows[0])
        return res.status(404).json({
            error: "We are unable to locate the customer with the provided id.",
        });
    return res.status(200).json(customer.rows[0]);
});
exports.GetCustomerByID = GetCustomerByID;
const GetCustomersByUserCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("kk");
    const categoryId = req.params.id;
    console.log("CATEID", categoryId);
    const result = yield model_1.UserCategory.findCustomer({ id: categoryId });
    if (!result.rows)
        return res.json({ message: "Error found" });
    return res.json(result.rows.map((list) => {
        return {
            customer: {
                id: list.id,
                product_sku: list.product_sku,
                name: list.first_name,
                last_name: list.last_name,
                email: list.email,
                tel: list.tel,
                business_licenses_no: list.business_licenses_no,
                plate_no: list.plate_no,
                territory: list.territory,
                city: list.city,
                type: list.type_id,
                approved_by: list.approved_by,
                categoryId: list.category_id,
            },
            usersCategory: {
                id: list.category_id,
                // name: list.name,
                desc: list._desc,
            },
        };
    }));
});
exports.GetCustomersByUserCategory = GetCustomersByUserCategory;
const GetCustomerBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    const { searchValue } = req.body;
    const result = yield model_1.Customer.findBySearch({ searchKey: searchValue });
    res.send(result.rows);
});
exports.GetCustomerBySearch = GetCustomerBySearch;
const UpdateCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    const customerInput = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfile, req.body);
    const customerInputErrors = yield (0, class_validator_1.validate)(customerInput, {
        validationError: { target: true },
    });
    if (customerInputErrors.length > 0) {
        return res.status(400).json(lodash_1.default.map(customerInputErrors, (error) => {
            return { err: error.constraints, property: error.property };
        }));
    }
    const customerId = req.params.id;
    let customer = (yield model_1.Customer.findById({ id: customerId }));
    if (!customer.rows[0])
        return res
            .status(404)
            .send({ error: "The customer with the given Id doesnot exist!" });
    const { first_name, last_name, email, tel, territory, city, category_id, business_licenses_no, plate_no, type_id, } = customerInput;
    customer.first_name = first_name;
    customer.last_name = last_name;
    customer.email = email;
    customer.tel = tel;
    customer.territory = territory;
    customer.city = city;
    customer.category_id = category_id;
    customer.business_licenses_no = business_licenses_no;
    customer.plate_no = plate_no;
    customer.type_id = type_id;
    const result = yield model_1.Customer.save({
        profile: customer,
        customerId: customerId,
    });
    // console.log("RES", result);
    // if (!result.rows[0])
    //   return res
    //     .status(404)
    //     .send({ error: "The customer with the given Id doesnot exist!" });
    res.send(true);
});
exports.UpdateCustomerProfile = UpdateCustomerProfile;
const DeleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.query.customerId;
    const result = yield model_1.Customer.findByIdAndRemove({
        id: customerId,
    });
    if (!result.rows[0])
        return res
            .status(404)
            .send("The customer with the given Id doesnot exist!");
    res.send(result.rows[0]);
});
exports.DeleteCustomer = DeleteCustomer;
const GetCustomerPaymentType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield model_1.Customer.findPayementTypeId();
    if (!customer.rows)
        return res.status(400).json({ message: "No Type Id Registered!" });
    return res.json(customer.rows);
});
exports.GetCustomerPaymentType = GetCustomerPaymentType;
/*
 * USER_CATEGORY SECTION
 */
const CreateUserCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, _desc } = req.body;
    const userCategory = new model_1.UserCategory({
        name,
        _desc,
        modified_at: new Date(),
    });
    const result = yield userCategory.Create();
    if (!result.rows[0])
        return res.json("Error found");
    return res.json({
        result: result.rows[0],
    });
});
exports.CreateUserCategory = CreateUserCategory;
const GetUserCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_1.UserCategory.find();
    if (!result.rows[0])
        return res.status(400).json("Error found");
    return res.json(result.rows);
});
exports.GetUserCategories = GetUserCategories;
const GetUserCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_1.UserCategory.findById({ id: req.params.id });
    if (!result.rows[0])
        return res.json({ message: "Error found" });
    return res.json(result.rows[0]);
});
exports.GetUserCategoryById = GetUserCategoryById;
const GetProductWithPrice_ByCategoryId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const listProduct = yield model_1.UserCategory.findByPriceAndCategoryByCategoryId({
        id: categoryId,
    });
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
                price: list.price,
                // categoryId: list.id,
            },
            price: list.price,
            usersCategory: {
                // id: list.id,
                name: list.name,
            },
        };
    }));
});
exports.GetProductWithPrice_ByCategoryId = GetProductWithPrice_ByCategoryId;
const UpdateUserCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    console.log(categoryId);
    const { name, _desc } = req.body;
    let userCategoriesData = (yield model_1.UserCategory.findById({
        id: categoryId,
    }));
    if (!userCategoriesData.rows[0])
        return res.status(404).json({
            message: "Unable to find user category with this id!",
        });
    userCategoriesData = userCategoriesData.rows[0];
    userCategoriesData.name = name;
    userCategoriesData._desc = _desc;
    userCategoriesData.modified_at = new Date();
    const result = yield model_1.UserCategory.save({
        info: userCategoriesData,
        id: categoryId,
    });
    if (!result.rows)
        return res.status(404).json({ message: "Invalid User Category" });
    return res.json(result.rows[0]);
});
exports.UpdateUserCategory = UpdateUserCategory;
const RemoveUsersCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const result = yield model_1.UserCategory.findByIdAndRemove({
        id: categoryId,
    });
    if (!result.rows[0])
        return res
            .status(404)
            .send("The users category with the given Id doesnot exist!");
    res.send(result.rows[0]);
});
exports.RemoveUsersCategory = RemoveUsersCategory;
