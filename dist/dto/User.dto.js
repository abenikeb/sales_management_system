"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.CreateCustomerInput = exports.CreateUserLogin = exports.EditProfile = exports.CreateUserType = void 0;
const class_validator_1 = require("class-validator");
class CreateUserType {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(7, 15)
], CreateUserType.prototype, "tel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 15)
], CreateUserType.prototype, "user_name", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 50)
], CreateUserType.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsInt)()
], CreateUserType.prototype, "user_group", void 0);
exports.CreateUserType = CreateUserType;
class EditProfile {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 50)
], EditProfile.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50)
], EditProfile.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)()
], EditProfile.prototype, "email", void 0);
exports.EditProfile = EditProfile;
class CreateUserLogin {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateUserLogin.prototype, "tel", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 50)
], CreateUserLogin.prototype, "password", void 0);
exports.CreateUserLogin = CreateUserLogin;
class CreateCustomerInput {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 250)
], CreateCustomerInput.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 250)
], CreateCustomerInput.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)()
], CreateCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateCustomerInput.prototype, "category_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 20)
], CreateCustomerInput.prototype, "tel", void 0);
__decorate([
    (0, class_validator_1.Length)(5, 250),
    (0, class_validator_1.IsNotEmpty)()
], CreateCustomerInput.prototype, "business_licenses_no", void 0);
__decorate([
    (0, class_validator_1.Length)(5, 250)
], CreateCustomerInput.prototype, "plate_no", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50)
], CreateCustomerInput.prototype, "territory", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 50)
], CreateCustomerInput.prototype, "city", void 0);
exports.CreateCustomerInput = CreateCustomerInput;
class EditCustomerProfile {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 50)
], EditCustomerProfile.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50)
], EditCustomerProfile.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)()
], EditCustomerProfile.prototype, "email", void 0);
exports.EditCustomerProfile = EditCustomerProfile;
