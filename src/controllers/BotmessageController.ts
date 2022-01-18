import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Botmessage from '@schemas/Botmessage';
import * as dotenv from 'dotenv';
import Room from "@schemas/Room";

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

        let countBotmessages_opt = 0;
        let next_order = 0;

        //when get status property
        if(req.query.id_option !== undefined){

            query.id_option = req.query.id_option;

            countBotmessages_opt = await Botmessage.countDocuments(query);

        }

        //when get status property
        if(req.query.order !== undefined){

            query.order = req.query.order;

            query.order = parseInt(query.order);

            if(query.order === countBotmessages_opt){
                next_order = 99;
            }else{
                next_order = query.order + 1;
            }

        }

        const botmessages:any = {};

        botmessages["messages"] = await Botmessage.find(query);
        botmessages["next"] = next_order;

        await mongoose.connection.close();

        return res.send(botmessages);

    }

}

export default BotmessageController;