import mongoose, { Document, Schema } from 'mongoose';

export interface ISentEmail extends Document {
    userId: string;
    email: string;
    dateSent: Date;
}

const sentEmailSchema: Schema<ISentEmail> = new Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    dateSent: { type: Date, default: Date.now }
});

const SentEmail = mongoose.model<ISentEmail>('SentEmails', sentEmailSchema);

export default SentEmail;
