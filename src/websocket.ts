import { io } from "./http";

interface RoomUser {
    socket_id: string,
    username: string,
    room: string,
    level: string,
    email: string,
    assunto: string,
    createdAt: Date
};

interface Message {
    text: string,
    username: string,
    room: string,
    level: string,
    createdAt: Date
};

interface Support {
    name: string,
    email: string,
    status: string
}

const users: RoomUser[] = [];
const messages: Message[] = [];
const supports: Support[] = [];

io.on("connection", socket => {

    socket.on("open_room",(data, callback) => {

        socket.join(data.room);

        const userInRoom = users.find(user => user.username === data.username && user.room === data.room);

        if(userInRoom){

            userInRoom.socket_id = socket.id;

        }else{

            const user: RoomUser = {
                room: data.room,
                username: data.username,
                level: data.level,
                email: data.email,
                assunto: data.assunto,
                socket_id: socket.id,
                createdAt: new Date()
            };

            users.push(user);

            if (user.level === "client") {
                io.emit("inbox", user);
                io.emit("newchat", user);
            }else{
                io.emit("answer", user);
            }

        }

        const messagesRoom = getMessagesRoom(data.room);

        if(messagesRoom.length === 0){

            if(supports.length === 0){
                io.emit("support_message", "offline");
            }else{
                io.emit("support_message", "online");
            }

        }

        const clients = users.filter(user => user.level === "client");

        callback(messagesRoom,clients);

        /*

        Ocultar mensagem ao voltar ao chat
        mostrar pop
        não retorna mensagens do banco

         */

    });

    socket.on("message", (data) => {

        const message: Message = {
            room: data.room,
            username: data.username,
            text: data.message,
            level: data.level,
            createdAt: new Date()
        };

        messages.push(message);

        io.to(data.room).emit("message", message);

    });

    socket.on("close_room",(data) => {

        socket.leave(data.room);

    });

    socket.on("open_support", (data) => {

        const support: Support = {
            name: data.name,
            email: data.email,
            status: data.status
        };

        supports.push(support);

    });

    socket.on("open_support", (data) => {

        const support: Support = {
            name: data.name,
            email: data.email,
            status: data.status
        };

        supports.push(support);

    });

    socket.on("answers", (data) => {



    });

});

function getMessagesRoom(room: string) {

    const messagesRoom = messages.filter(message => message.room === room);

    return messagesRoom;

}
