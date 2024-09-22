import mongoose from 'mongoose';

const sessionSettingsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    sessionId:{type: String,required:true},
});

const SessionSettings = mongoose.model('SessionSettings', sessionSettingsSchema);
export default SessionSettings;
