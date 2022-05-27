import express from "express";
const router = express.Router();

import {
  UserSignUp,
  UserLogin,
  GetUserProfile,
  EditUserProfile,
  CreateCustomer,
  GetCustomers,
  GetCustomerByID,
  GetCustomerBySearch,
  UpdateCustomerProfile,
  DeleteCustomer,
  CreateUserCategory,
  GetUserCategories,
  GetCustomersByUserCategory,
  GetUserCategoryById,
  UpdateUserCategory,
  RemoveUsersCategory,
  GetProductWithPrice_ByCategoryId,
} from "../controller";
import { AdminAuth, Authenticate } from "../middleware";

/*
AUTH SECTION
*/
router.post("/signup", UserSignUp);
router.post("/login", UserLogin);

/*
PROFILE SECTION
*/
router.get("/profile", Authenticate, GetUserProfile);
router.patch("/edit_profile", Authenticate, EditUserProfile);

/*
CUSTOMERS SECTION
*/
router.post("/create-customer", Authenticate, CreateCustomer);
router.get("/get-customers", Authenticate, GetCustomers);
router.get("/get-customers-by-id/:id", Authenticate, GetCustomerByID);
router.get(
  "/get-customers-by-category-id?:id",
  Authenticate,
  GetCustomersByUserCategory
);
router.get("/get-customers-by-search", Authenticate, GetCustomerBySearch);
router.patch(
  "/update-customer-profile?:customerId",
  Authenticate,
  UpdateCustomerProfile
);
router.delete("/remove-customer", [Authenticate, AdminAuth], DeleteCustomer);

/*
USER CAEGORY SECTION
*/
router.post("/create-user-category", Authenticate, CreateUserCategory);
router.get("/get-user-categories", Authenticate, GetUserCategories);
router.get("/get-user-category-by-id/:id", Authenticate, GetUserCategoryById);

router.patch("/update-user-category?:id", Authenticate, UpdateUserCategory);
router.delete(
  "/remove-user-category/:id",
  [Authenticate, AdminAuth],
  RemoveUsersCategory
);
router.get(
  "/get-all-product-with-price-by-category-id?:id",
  Authenticate,
  GetProductWithPrice_ByCategoryId
);

export { router as UserRoute };
