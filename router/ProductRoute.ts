import express from "express";
import {
  AddProduct,
  GetProducts,
  GetProductById,
  AddProductPrice,
  AddProductPromotion,
  UpdateProduct,
  RemoveProduct,
  GetAllProductsWithPriceAndCategory,
  GetProductWithPriceAndCategory_ById,
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
import { AdminAuth } from "../middleware";
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

/*
 * PRODUCT SECTION
 */
router.post("/add", [Authenticate, images], AddProduct);
router.get("/get", Authenticate, GetProducts);
router.get(
  "/get-all-product-with-price-and-category",
  Authenticate,
  GetAllProductsWithPriceAndCategory
);
router.get(
  "/get-all-product-with-price-and-category-by-category-id?:id",
  Authenticate,
  GetProductWithPriceAndCategory_ById
);
router.get("/get-by-id", Authenticate, GetProductById);
router.patch("/update?:id", Authenticate, UpdateProduct);
router.delete("/remove/:id", [Authenticate, AdminAuth], RemoveProduct);
// ** update or delete on table "products" violates foreign key constraint "product_prices_product_id_fkey" on table "product_prices"

/*
 * PRODUCT PRICE SECTION
 */

router.post("/add-price", Authenticate, AddProductPrice);

/*
 * PRODUCT PROMOTION SECTION
 */

router.post("/add-promotion", Authenticate, AddProductPromotion);

// //order section
// router.get("/orders", GetOrdersVandor);
// router.put("/orders/:id/process", ProcessOrder);
// router.get("/order/:id", GetOrdersDetail);

export { router as ProductRoute };
