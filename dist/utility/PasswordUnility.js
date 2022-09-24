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
exports.ValidateSignture = exports.GenerateSignature = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
require("dotenv").config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
const GenerateSignature = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_PRIVATE_KEY);
};
exports.GenerateSignature = GenerateSignature;
const ValidateSignture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("x-auth-token");
    if (!token)
        return false;
    try {
        // const payload = (await jwt.verify(
        //   token.split(" ")[1],
        //   process.env.JWT_PRIVATE_KEY as string
        // )) as UserPayload;
        const payload = (yield jsonwebtoken_1.default.verify(token, process.env.JWT_PRIVATE_KEY));
        req.user = payload;
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.ValidateSignture = ValidateSignture;
