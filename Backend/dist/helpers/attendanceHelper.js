"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementOrDecrementAttendance = exports.updateAttendance = exports.getAttendanceRecords = void 0;
const Attendance_js_1 = __importDefault(require("../model/Attendance.js"));
const User_js_1 = __importDefault(require("../model/User.js"));
// Fetch attendance records from User schema
const getAttendanceRecords = async () => {
    try {
        // Find all users and select relevant fields: userId, attendanceCount, etc.
        const users = await User_js_1.default.find({}, { userId: 1, userName: 1, attendanceCount: 1 }).lean();
        return users; // Return the list of users with their attendance count
    }
    catch (error) {
        console.error('Error fetching attendance records:', error);
        throw new Error('Error fetching attendance records');
    }
};
exports.getAttendanceRecords = getAttendanceRecords;
const updateAttendance = async (userId, attended, sessionId) => {
    const user = await User_js_1.default.findOne({ userId });
    if (!user) {
        throw new Error('User not found');
    }
    // Check if the user has already attended this session
    const existingRecord = await Attendance_js_1.default.findOne({ userId, sessionId });
    if (existingRecord) {
        // User has already attended this session
        return { user, message: 'Attendance already recorded for this session', attendanceRecord: existingRecord };
    }
    // Update attendance count
    if (attended) {
        user.attendanceCount += 1;
    }
    else {
        if (user.attendanceCount > 0) {
            user.attendanceCount -= 1;
        }
        else {
            throw new Error('Attendance count cannot be negative');
        }
    }
    await user.save();
    const today = new Date();
    const attendanceRecord = new Attendance_js_1.default({
        userId,
        date: today.toISOString().split('T')[0],
        attended: attended,
        sessionId: sessionId,
    });
    try {
        await attendanceRecord.save();
    }
    catch (error) {
        console.error('Error saving attendance record:', error);
    }
    return { user, attendanceRecord };
};
exports.updateAttendance = updateAttendance;
const incrementOrDecrementAttendance = async (userId, increment) => {
    const user = await User_js_1.default.findOne({ userId });
    if (!user) {
        throw new Error('User not found');
    }
    // Increment or decrement attendance count based on 'increment' flag
    if (increment) {
        user.attendanceCount += 1;
    }
    else {
        if (user.attendanceCount > 0) {
            user.attendanceCount -= 1;
        }
        else {
            throw new Error('Attendance count cannot be negative');
        }
    }
    await user.save();
    return user;
};
exports.incrementOrDecrementAttendance = incrementOrDecrementAttendance;
