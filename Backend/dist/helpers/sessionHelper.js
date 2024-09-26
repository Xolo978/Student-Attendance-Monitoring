"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionHelper = exports.getSessionSettingsHelper = exports.saveSessionSettingsHelper = exports.getSessionByIdHelper = void 0;
const SessionSettings_1 = __importDefault(require("../model/SessionSettings"));
const getSessionByIdHelper = async (sessionId) => {
    const session = await SessionSettings_1.default.findOne({ sessionId });
    if (session) {
        return {
            _id: session._id,
            date: session.date, // No conversion to IST
            startTime: session.startTime, // Keep as is
            endTime: session.endTime, // Keep as is
            sessionId: session.sessionId,
        };
    }
    return null;
};
exports.getSessionByIdHelper = getSessionByIdHelper;
const saveSessionSettingsHelper = async (date, startTime, endTime, sessionId) => {
    // Parse startTime and endTime
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    // Create Date objects for start and end times
    const startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes);
    const endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes);
    // Save the session without any timezone conversion
    const newSession = new SessionSettings_1.default({
        date: date.toISOString().split('T')[0], // Format date to 'yyyy-MM-dd' without time zone conversion
        startTime: startTime, // Keep as is
        endTime: endTime, // Keep as is
        sessionId: sessionId,
    });
    await newSession.save();
};
exports.saveSessionSettingsHelper = saveSessionSettingsHelper;
const getSessionSettingsHelper = async () => {
    const settings = await SessionSettings_1.default.find({});
    return settings.map(setting => {
        // Parse the start and end times as is without converting them to IST
        return {
            _id: setting._id,
            date: setting.date, // Keep as is
            startTime: setting.startTime, // Keep as is
            endTime: setting.endTime, // Keep as is
            sessionId: setting.sessionId,
        };
    });
};
exports.getSessionSettingsHelper = getSessionSettingsHelper;
const deleteSessionHelper = async (sessionId) => {
    const deletedSession = await SessionSettings_1.default.findByIdAndDelete(sessionId);
    return deletedSession !== null;
};
exports.deleteSessionHelper = deleteSessionHelper;
