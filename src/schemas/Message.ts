import mongoose, { Document, Schema } from 'mongoose';

type Babytalk = Document & {};

export const MessageSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        },
        username: {
            type: String,
            required: true
        },
        text: {
            type: Number,
            required: true
        },
        level: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('message', MessageSchema, 'messages');
