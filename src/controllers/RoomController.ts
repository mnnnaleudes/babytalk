import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Room from '@schemas/Room';
import * as dotenv from 'dotenv';

class RoomController {

    /*
    Create a room
     */
    async store(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        const createdRoom = await Room.create(req.body);

        await mongoose.connection.close();

        return res.json(createdRoom);

    };

    /*
    update room
     */
    async update(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        //when undefined id
        if(req.body.id === undefined){
            return res.status(400).send({message:'Undefined id'});
        }

        const validId = mongoose.Types.ObjectId.isValid(req.body.id);
        //when id is not valid
        if (!validId) {
            return res.status(400).send({message:'Its not valid Objectid'});
        }

        //when undefined status
        if(req.body.status === undefined) {
            return res.status(400).send({message:'Undefined status'});
        }

        const query:any = {};
        const set:any = {};

        query._id = req.body.id;
        set.status = req.body.status;
        set.suport_name = req.body.suport_name;
        set.suport_email = req.body.suport_email;

        const countRoom = await Room.countDocuments(query);

        if(countRoom <= 0){
            throw new Error('Room not found');
        }

        const updatedRoom = await Room.updateOne(query,set);

        await mongoose.connection.close();

        return res.status(200).send(updatedRoom);

    }

    async list(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        const query:any = {};

        //when get status property
        if(req.query.status !== undefined){

            query.status = req.query.status;

        }

        const createdRoom = await Room.find(query);

        await mongoose.connection.close();

        return res.send(createdRoom);

    }

};

export default RoomController;