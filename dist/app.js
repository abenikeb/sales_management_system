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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const ExpressApp_1 = __importDefault(require("./service/ExpressApp"));
const app = (0, express_1.default)();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, ExpressApp_1.default)(app);
        // const port = process.env.PORT || 5000;
        const port = 5000;
        app.listen(port, () => {
            console.log(`Server is listing on Port ${port}`);
        });
    });
}
startServer();
