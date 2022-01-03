import mongoose, { Document, Schema } from 'mongoose';

type Babytalk = Document & {};

export const SupportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: false
    }
);

export default mongoose.model('Support', SupportSchema, 'support');
