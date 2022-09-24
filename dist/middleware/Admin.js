"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuth = void 0;
const AdminAuth = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_group) !== 1)
        return res.status(403).send("Access Denied!");
    next();
};
exports.AdminAuth = AdminAuth;
