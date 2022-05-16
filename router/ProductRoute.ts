import express from "express";
import {
  AddProduct,
  GetProducts,
  AddProductPrice,
  AddProductPromotion,
  //   UpdateVendorCoverImage,
  //   UpdateVendorProfile,
  //   UpdateVendorProfile,
  // UpdateVendorService,
  //   VendorLogin,
  //   GetOrdersDetail,
  //   ProcessOrder,
} from "../controller/ProductController";

import { Authenticate } from "../middleware/CommonAuth";
import multer from "multer";
const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "images");
  },
  filename: function (req: any, file: any, cb: any) {
    // cb(null, new Date().toISOString() + '_' + file.originalname)
    cb(null, file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

// router.post("/login", VendorLogin);

//profile section
// router.get("/profile", Authenticate, GetVendorProfile);
// router.post("/updateProfile", Authenticate, UpdateVendorProfile);
// router.post("/updateCover", images, UpdateVendorCoverImage);
// router.post("/updateService", Authenticate, UpdateVendorService);

// //product section
router.post("/add", [Authenticate, images], AddProduct);
router.get("/get", Authenticate, GetProducts);
router.post("/add-price", Authenticate, AddProductPrice);
router.post("/add-promotion", Authenticate, AddProductPromotion);
// router.get("/groceries", GetGroceries);

// //order section
// router.get("/orders", GetOrdersVandor);
// router.put("/orders/:id/process", ProcessOrder);
// router.get("/order/:id", GetOrdersDetail);

export { router as ProductRoute };
