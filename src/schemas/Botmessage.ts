import mongoose, { Document, Schema } from 'mongoose';

type Babytalk = Document & {};

export const BotmessageSchema = new mongoose.Schema(
    {
        id_message: {
            type: Number,
            required: true
        },
        id_option: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: false
    }
);

export default mongoose.model('Botmessage', BotmessageSchema, 'botmessages');