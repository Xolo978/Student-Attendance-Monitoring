import mongoose, { Document, Schema } from 'mongoose';
import { violationSchema } from './Violation.js';

export interface IUser extends Document {
    username: string;
    userId: string; // Add userId
    password: string;
    email?: string; // Optional email field
    attendanceCount: number; // Total attendance count
    violations: Array<{
        date: Date;
        type: string;
    }>;
}

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: false, unique: false },
    userId: { type: String, required: true, unique: true }, // Add userId
    password: { type: String, required: true },
    email: { type: String, required: false }, // Add email field
    attendanceCount: { type: Number, default: 0 }, // Total attendance count
    violations: [violationSchema],
});

const User = mongoose.model<IUser>('Users', userSchema);

export default User;
