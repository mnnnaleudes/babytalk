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

routes.put('/room', Room.update);

routes.get('/room', Room.list);

/*
end room routes
 */

export default routes;