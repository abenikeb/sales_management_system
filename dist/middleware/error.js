"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const winston = require("winston");
const error = (err, req, res, next) => {
    winston.error(err.message, err);
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
    res.status(500).send("Something failed.");
};
exports.error = error;
