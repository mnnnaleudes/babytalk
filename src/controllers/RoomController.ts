import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Room from '@schemas/Room';
import * as dotenv from 'dotenv';

class RoomController {

    async store(req: Request, res: Response) {

        console.log(process.env.MONGO_URL)

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        //console.log(req);

        const createdRoom = await Room.create(req.body);

        await mongoose.connection.close();

        console.log("room",createdRoom);

        return res.json(createdRoom);

    };

};

export default RoomController;