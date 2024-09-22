"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionHelper = exports.getSessionSettingsHelper = exports.saveSessionSettingsHelper = exports.getSessionByIdHelper = void 0;
const SessionSettings_1 = __importDefault(require("../model/SessionSettings"));
const date_fns_tz_1 = require("date-fns-tz");
const IST_TIME_ZONE = 'Asia/Kolkata';
const getSessionByIdHelper = async (sessionId) => {
    const session = await SessionSettings_1.default.findOne({ sessionId });
    if (session) {
        return {
            _id: session._id,
            date: (0, date_fns_tz_1.format)((0, date_fns_tz_1.toZonedTime)(new Date(session.date), IST_TIME_ZONE), 'yyyy-MM-dd'),
            startTime: session.startTime,
            endTime: session.endTime,
            sessionId: session.sessionId,
        };
    }
    return null;
};
exports.getSessionByIdHelper = getSessionByIdHelper;
const saveSessionSettingsHelper = async (date, startTime, endTime, sessionId) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes);
    const endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes);
    const istStartTime = (0, date_fns_tz_1.toZonedTime)(startDateTime, IST_TIME_ZONE);
    const istEndTime = (0, date_fns_tz_1.toZonedTime)(endDateTime, IST_TIME_ZONE);
    const newSession = new SessionSettings_1.default({
        date: (0, date_fns_tz_1.format)((0, date_fns_tz_1.toZonedTime)(date, IST_TIME_ZONE), 'yyyy-MM-dd'),
        startTime: (0, date_fns_tz_1.format)(istStartTime, 'HH:mm'),
        endTime: (0, date_fns_tz_1.format)(istEndTime, 'HH:mm'),
        sessionId: sessionId,
    });
    await newSession.save();
};
exports.saveSessionSettingsHelper = saveSessionSettingsHelper;
const getSessionSettingsHelper = async () => {
    const settings = await SessionSettings_1.default.find({});
    return settings.map(setting => {
        const startDate = new Date(setting.date);
        const startHoursMinutes = setting.startTime.split(':').map(Number);
        const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startHoursMinutes[0], startHoursMinutes[1]);
        const endDate = new Date(setting.date);
        const endHoursMinutes = setting.endTime.split(':').map(Number);
        const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endHoursMinutes[0], endHoursMinutes[1]);
        const istStartTime = (0, date_fns_tz_1.toZonedTime)(startDateTime, IST_TIME_ZONE);
        const istEndTime = (0, date_fns_tz_1.toZonedTime)(endDateTime, IST_TIME_ZONE);
        const formattedDate = (0, date_fns_tz_1.format)((0, date_fns_tz_1.toZonedTime)(startDate, IST_TIME_ZONE), 'yyyy-MM-dd');
        return {
            _id: setting._id,
            date: formattedDate,
            startTime: (0, date_fns_tz_1.format)(istStartTime, 'HH:mm'),
            endTime: (0, date_fns_tz_1.format)(istEndTime, 'HH:mm'),
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
