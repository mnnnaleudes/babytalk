import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Message from '@schemas/Message';
import * as dotenv from 'dotenv';

class MessageController {

    /*
    Create a message
     */
    async store(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        const createdMessage = await Message.create(req.body);

        await mongoose.connection.close();

        return res.json(createdMessage);

    };


    /*
        list message
         */
    async list(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        const query:any = {};

        //when get room property
        if(req.query.room !== undefined){

            query.room = req.query.room;

        }

        //when get username property
        if(req.query.username !== undefined){

            query.username = req.query.username;

        }

        //when get level property
        if(req.query.level !== undefined){

            query.level = req.query.level;

        }

        const messages = await Message.find(query);

        await mongoose.connection.close();

        return res.send(messages);

    }

}

export default MessageController;
