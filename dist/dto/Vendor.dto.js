"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVendorLogin = exports.CreateVendorInput = void 0;
const class_validator_1 = require("class-validator");
class CreateVendorInput {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 250)
], CreateVendorInput.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], CreateVendorInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1)
], CreateVendorInput.prototype, "owner_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 50)
], CreateVendorInput.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 20)
], CreateVendorInput.prototype, "tel", void 0);
__decorate([
    (0, class_validator_1.Length)(5, 250)
], CreateVendorInput.prototype, "address_line1", void 0);
__decorate([
    (0, class_validator_1.Length)(5, 250)
], CreateVendorInput.prototype, "address_line2", void 0);
__decorate([
    (0, class_validator_1.Length)(5, 50)
], CreateVendorInput.prototype, "city", void 0);
exports.CreateVendorInput = CreateVendorInput;
class CreateVendorLogin {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], CreateVendorLogin.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 50)
], CreateVendorLogin.prototype, "password", void 0);
exports.CreateVendorLogin = CreateVendorLogin;
