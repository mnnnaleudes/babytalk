import { Router } from 'express';
import RoomController from "@controllers/RoomController";

const routes = Router();

const Room = new RoomController;

/*
room routes

suport_name:
suport_email:
client_name:
client_email:
subject:
date:
status:

 */

routes.post('/room', Room.store);

/*
end room routes
 */

export default routes;