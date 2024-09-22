"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSettingsSchema = new mongoose_1.default.Schema({
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    sessionId: { type: String, required: true },
});
const SessionSettings = mongoose_1.default.model('SessionSettings', sessionSettingsSchema);
exports.default = SessionSettings;
