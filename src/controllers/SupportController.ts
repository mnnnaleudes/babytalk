import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Support from '@schemas/Support';
import * as dotenv from 'dotenv';
import Room from "@schemas/Room";

class SupportController {

    /*
    update support
     */
    async update(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true,
        });

        //when undefined id
        if(req.body.email === undefined){
            return res.status(400).send({message:'Undefined email'});
        }

        //when undefined status
        if(req.body.status === undefined) {
            return res.status(400).send({message:'Undefined status'});
        }

        const query:any = {};
        const set:any = {};

        query.email = req.body.email;
        set.status = req.body.status;

        const countSupport = await Support.countDocuments(query);

        if(countSupport <= 0){
            throw new Error('Support not found');
        }

        const updatedSupport = await Support.updateOne(query,set);

        await mongoose.connection.close();

        return res.status(200).send(updatedSupport);

    }

    async list(req: Request, res: Response) {

        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized');
        }

        await mongoose.connect(process.env.MONGO_URL, {
            autoIndex: true,
        });

        const query:any = {};

        //when get status property
        if(req.query.status !== undefined){

            query.status = req.query.status;

        }

        const createdSupport = await Support.find(query);

        //await mongoose.connection.close();

        return res.send(createdSupport);

    }

};

export default SupportController;
