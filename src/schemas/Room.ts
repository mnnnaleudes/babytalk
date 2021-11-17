import mongoose, { Document, Schema } from 'mongoose';

type Babytalk = Document & {};

export const RoomSchema = new mongoose.Schema(
    {
        suport_name: {
            type: String,
            required: false
        },
        suport_email: {
            type: String,
            required: false
        },
        client_name: {
            type: String,
            required: true
        },
        client_email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Room', RoomSchema, 'rooms');