"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controller/ProductController");
const CommonAuth_1 = require("../middleware/CommonAuth");
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.ProductRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString() + '_' + file.originalname)
        cb(null, file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
// router.post("/login", VendorLogin);
//profile section
// router.get("/profile", Authenticate, GetVendorProfile);
// router.post("/updateProfile", Authenticate, UpdateVendorProfile);
// router.post("/updateCover", images, UpdateVendorCoverImage);
// router.post("/updateService", Authenticate, UpdateVendorService);
/*
 * PRODUCT SECTION
 */
router.post("/add", [CommonAuth_1.Authenticate, images], ProductController_1.AddProduct);
router.get("/get", CommonAuth_1.Authenticate, ProductController_1.GetProducts);
router.get("/get-all-product-with-price-and-category", CommonAuth_1.Authenticate, ProductController_1.GetAllProductsWithPriceAndCategory);
router.get("/get-all-product-with-price-and-category-by-category-id?:id", CommonAuth_1.Authenticate, ProductController_1.GetProductWithPriceAndCategory_ById);
router.get("/get-by-id", CommonAuth_1.Authenticate, ProductController_1.GetProductById);
router.patch("/update?:id", CommonAuth_1.Authenticate, ProductController_1.UpdateProduct);
router.delete("/remove/:id", [CommonAuth_1.Authenticate, middleware_1.AdminAuth], ProductController_1.RemoveProduct);
// ** update or delete on table "products" violates foreign key constraint "product_prices_product_id_fkey" on table "product_prices"
/*
 * PRODUCT PRICE SECTION
 */
router.post("/add-price", CommonAuth_1.Authenticate, ProductController_1.AddProductPrice);
/*
 * PRODUCT PROMOTION SECTION
 */
router.post("/add-promotion", CommonAuth_1.Authenticate, ProductController_1.AddProductPromotion);
