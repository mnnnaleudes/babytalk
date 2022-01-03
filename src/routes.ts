import { Router } from 'express';
import RoomController from "@controllers/RoomController";
import SupportController from "@controllers/SupportController";

const routes = Router();

const Room = new RoomController;

const Support = new SupportController;

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

/*
support routes

name:
email:
status:

 */

routes.put('/support', Support.update);

routes.get('/support', Support.list);

/*
end room routes
 */

export default routes;
