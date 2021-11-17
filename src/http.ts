import "./lib/env";
import express from "express";
import routes from './routes';
import bodyParser from 'body-parser';
import http from "http";
import { Server } from "socket.io";

const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname,"..","public")));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(routes);

const serverHttp = http.createServer(app);

const io = new Server(serverHttp);

export { serverHttp, io }