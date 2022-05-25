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
} from "../controller";
import { Authenticate } from "../middleware/CommonAuth";

// Signup User
router.post("/signup", UserSignUp);
// Login User
router.post("/login", UserLogin);

/*
profile
*/
router.get("/profile", Authenticate, GetUserProfile);
router.patch("/edit_profile", Authenticate, EditUserProfile);

//customer
router.post("/create-customer", Authenticate, CreateCustomer);
router.get("/get-customers", Authenticate, GetCustomers);
router.get("/get-customers-by-id/:id", Authenticate, GetCustomerByID);

export { router as UserRoute };
