"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.violationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.violationSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true },
});
