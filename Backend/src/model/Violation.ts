import mongoose, { Schema } from 'mongoose';

export const violationSchema: Schema = new Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true }, 
});
