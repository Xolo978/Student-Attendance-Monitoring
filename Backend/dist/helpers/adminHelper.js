"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginHelper = void 0;
const Admin_js_1 = __importDefault(require("../model/Admin.js"));
const adminLoginHelper = async (username, password) => {
    const admin = await Admin_js_1.default.findOne({ username });
    if (admin && admin.password === password) {
        return { success: true };
    }
    return { success: false };
};
exports.adminLoginHelper = adminLoginHelper;
