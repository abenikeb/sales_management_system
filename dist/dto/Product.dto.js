"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductPrmotion = exports.CreateProductPrice = exports.CreateProductInput = void 0;
const class_validator_1 = require("class-validator");
class CreateProductInput {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(7, 15)
], CreateProductInput.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 250)
], CreateProductInput.prototype, "desc", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "category_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "product_image", void 0);
__decorate([
    (0, class_validator_1.IsInt)()
], CreateProductInput.prototype, "inventory_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "SKU_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "tag_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)()
], CreateProductInput.prototype, "vender_id", void 0);
exports.CreateProductInput = CreateProductInput;
class CreateProductPrice {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(1000)
], CreateProductPrice.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)()
], CreateProductPrice.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)()
], CreateProductPrice.prototype, "user_categories_id", void 0);
exports.CreateProductPrice = CreateProductPrice;
class CreateProductPrmotion {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(1000)
], CreateProductPrmotion.prototype, "amount_price", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)()
], CreateProductPrmotion.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)()
], CreateProductPrmotion.prototype, "user_categories_id", void 0);
exports.CreateProductPrmotion = CreateProductPrmotion;
