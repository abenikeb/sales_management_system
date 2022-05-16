import express from "express";
const router = express.Router();

import {
  UserSignUp,
  UserLogin,
  GetUserProfile,
  EditUserProfile,
  CreateCustomer,
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
router.post("/create-customer", Authenticate, CreateCustomer);

export { router as UserRoute };
