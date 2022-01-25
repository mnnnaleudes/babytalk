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
            type: String,
            required: true
        },
        level: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('message', MessageSchema, 'messages');
