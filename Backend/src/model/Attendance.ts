import mongoose, { Document, Schema } from 'mongoose';

interface IAttendance extends Document {
    userId: string;   
    name: string;     
    date: Date;       
    attended: boolean;
    sessionId: string;
}

const attendanceSchema = new Schema<IAttendance>({
    userId: { type: String, required: true },
    name: { type: String, required: false },
    date: { type: Date, required: true, }, 
    attended: { type: Boolean, required: true }, 
    sessionId: { type: String, required: true }
});

const Attendance = mongoose.model<IAttendance>('Attendances', attendanceSchema);

export default Attendance;
