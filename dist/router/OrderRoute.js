"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.OrderRoute = router;
const controller_1 = require("../controller");
const CommonAuth_1 = require("../middleware/CommonAuth");
router.post("/create", CommonAuth_1.Authenticate, controller_1.CreateOrder);
router.patch("/approve", CommonAuth_1.Authenticate, controller_1.approveOrderStatus);
