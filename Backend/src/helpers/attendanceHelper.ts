import Attendance from '../model/Attendance.js';
import User from '../model/User.js';

export const getAttendanceRecords = async () => {
    try {
        const users = await User.find({}, { userId: 1, userName: 1, attendanceCount: 1 }).lean();
        return users; // Return the list of users with their attendance count
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        throw new Error('Error fetching attendance records');
    }
};

export const updateAttendance = async (userId: string, attended: boolean, sessionId: string) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error('User not found');
    }

    // Check if the user has already attended this session
    const existingRecord = await Attendance.findOne({ userId, sessionId });
    if (existingRecord) {
        // User has already attended this session
        return { user, message: 'Attendance already recorded for this session', attendanceRecord: existingRecord };
    }

    // Update attendance count
    if (attended) {
        user.attendanceCount += 1;
    } else {
        if (user.attendanceCount > 0) {
            user.attendanceCount -= 1;
        } else {
            throw new Error('Attendance count cannot be negative');
        }
    }
    await user.save();

    const today = new Date();
    const attendanceRecord = new Attendance({
        userId,
        date: today.toISOString().split('T')[0],
        attended: attended,
        sessionId: sessionId,
    });

    try {
        await attendanceRecord.save();
    } catch (error) {
        console.error('Error saving attendance record:', error);
    }

    return { user, attendanceRecord };
};

export const incrementOrDecrementAttendance = async (userId: string, increment: boolean) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error('User not found');
    }
    if (increment) {
        user.attendanceCount += 1;
    } else {
        if (user.attendanceCount > 0) {
            user.attendanceCount -= 1;
        } else {
            throw new Error('Attendance count cannot be negative');
        }
    }

    await user.save();
    return user;
};
