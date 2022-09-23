"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
require("../controller");
const router = express_1.default.Router();
exports.AdminRoute = router;
// router.post("/vendor", [Authenticate, AdminAuth], CreateVendor);
// router.get("/vandors", GetVanndors);
// router.get("/vandor/:id", GetVandorByID);
// router.get("/transaction", GetTransaction);
// router.get("/transaction/:id", GetTransactionByID);
// router.get("/deliveries", GetDeliveryBoys);
// router.put("/verify-deliveries/:id", VerifyDeliveryBoys);
router.get("/", (req, res, next) => {
    res.json({
        message: "Heye there! this is Sales Management Syatem Admin DashBoard",
    });
});
