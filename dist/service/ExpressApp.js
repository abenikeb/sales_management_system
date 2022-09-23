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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const router_1 = require("../router");
const error_1 = require("../middleware/error");
const cors = require("cors");
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(body_parser_1.default.json());
    app.use(cors());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
    app.use("/api/admin", router_1.AdminRoute);
    app.use("/api/user", router_1.UserRoute);
    app.use("/api/order", router_1.OrderRoute);
    app.use("/api/product", router_1.ProductRoute);
    app.use(error_1.error);
    return app;
});
// export interface IGetUserAuthInfoRequest extends Request {
//   user?: string; // or any other type
// }
