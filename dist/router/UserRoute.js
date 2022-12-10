"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.UserRoute = router;
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
/*
AUTH SECTION
*/
router.post("/signup", controller_1.UserSignUp);
router.post("/login", controller_1.UserLogin);
/*
PROFILE SECTION
*/
router.get("/profile", middleware_1.Authenticate, controller_1.GetUserProfile);
router.patch("/edit_profile", middleware_1.Authenticate, controller_1.EditUserProfile);
/*
CUSTOMERS SECTION
*/
router.post("/create-customer", middleware_1.Authenticate, controller_1.CreateCustomer);
router.get("/get-customers", middleware_1.Authenticate, controller_1.GetOrders);
router.get("/get-customers-by-id/:id", middleware_1.Authenticate, controller_1.GetCustomerByID);
router.get("/get-customers-by-category-id/:id", middleware_1.Authenticate, controller_1.GetCustomersByUserCategory);
router.get("/get-customers-by-search", middleware_1.Authenticate, controller_1.GetCustomerBySearch);
router.put("/update-customer-profile/:id", middleware_1.Authenticate, controller_1.UpdateCustomerProfile);
router.delete("/remove-customer", [middleware_1.Authenticate, middleware_1.AdminAuth], controller_1.DeleteCustomer);
router.get("/find-payement-type-id", middleware_1.Authenticate, controller_1.GetCustomerPaymentType);
/*
USER CATEGORY SECTION
*/
router.post("/create-user-category", middleware_1.Authenticate, controller_1.CreateUserCategory);
router.get("/get-user-categories", middleware_1.Authenticate, controller_1.GetUserCategories);
router.get("/get-user-category-by-id/:id", middleware_1.Authenticate, controller_1.GetUserCategoryById);
router.put("/update-user-category/:id", middleware_1.Authenticate, controller_1.UpdateUserCategory);
router.delete("/remove-user-category/:id", [middleware_1.Authenticate, middleware_1.AdminAuth], controller_1.RemoveUsersCategory);
router.get("/get-all-product-with-price-by-category-id/:id", middleware_1.Authenticate, controller_1.GetProductWithPrice_ByCategoryId);
