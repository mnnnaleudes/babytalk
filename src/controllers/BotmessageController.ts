import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Botmessage from '@schemas/Botmessage';
import * as dotenv from 'dotenv';

class BotmessageController {

    /*
        list room
         */
    async list(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true
        });

        const query:any = {};

        //when get status property
        if(req.query.id_option !== undefined){

            query.option = req.query.id_option;

        }

        //when get status property
        if(req.query.order !== undefined){

            query.order = req.query.order;

        }

        const botmessages = await Botmessage.find(query);

        await mongoose.connection.close();

        return res.send(botmessages);

    }

}