const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
let room = "";
const level = urlSearch.get("level");
const email = urlSearch.get("email");
const assunto = urlSearch.get("assunto");

/*

Criar metodos para abertura de salas (desenhar)

 */

if(level == 'client') {
    // create a JSON object
    const json = {
        client_name: username,
        client_email: email,
        subject: assunto,
        status: 1
    };

    // request options
    const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // send post request
    fetch('http://localhost:3000/room', options)
        .then(res => res.text())
        .then(data => {
            room = data._id;
        })
        .catch(err => console.error(err));

}

socket.emit("open_room", {
    username,
    room,
    level,
    email,
    assunto
}, (messages, clients) => {
    messages.forEach((message) => createMessage(message));
    clients.forEach((client) => createInbox(client));
});

document.getElementById("input_msg").addEventListener("keypress", (event) => {

    if(event.key === 'Enter'){

        const message = event.target.value;
        event.target.value = "";

        const data = {
            room,
            username,
            message
        }

        socket.emit("message", data);
    }

});

socket.on("message", (data) => {

    createMessage(data);

});

socket.on("inbox", (data) => {

    createInbox(data);

});

socket.on("answer", (data) => {

    createInbox(data);

});

function createMessage(data){

    const myUser = (data.username === username);

    const messageBox = document.getElementById("box_msg");

    if(myUser){
        messageBox.innerHTML +=`
            <div class="outgoing_msg">
                <div class="sent_msg">
                    <p>${data.text}</p>
                    <span class="time_date">${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                </div>
            </div>`;
    }else{
        messageBox.innerHTML +=`
            <div class="incoming_msg">
                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="received_msg">
                    <div class="received_withd_msg">
                        <p>${data.text}</p>
                        <span class="username_msg">${data.username}</span>
                        <span class="time_date">${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                    </div>
                </div>
            </div>`;

    }

    messageBox.scrollTop = messageBox.scrollHeight;

}

function createInbox(data){

    const inbox = document.getElementById("inbox_msg");

    if(inbox !== null) {

        inbox.innerHTML += `
        <div class="chat_list">
            <div class="chat_people" onclick="window.open('http://localhost:3000/support.html?username=Robs&select_room=${data.room}&level=suport&email=rob@alobebe.com.br','_self')">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                    <span class="time_date">${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                    <h5>${data.username}</h5>
                    <p>${data.email}</p>
                    <div>
                        <p class="subject_chat">${data.assunto}</p>
                        <span class="status_chat chat_online">on-line</span>
                    </div>
                    
              </div>
            </div>
          </div>`;

        inbox.scrollTop = 0;
    }

}

function confirm_close_chat(acao){

    if (acao === "close"){

        const message = `O cliente ${username} finalizou o atendimento`;

        const data = {
            room,
            username: "alobebe",
            message
        }

        socket.emit("message", data);

        socket.emit("close_room", {
            room
        });
    }else{

        document.getElementById("input_msg").style.visibility="visible";
        document.getElementById("send_btn").style.visibility="visible";

        const lastMessage = document.getElementById("input_msg").lastChild;

        console.log(lastMessage);

        //lastMessage.remove();

    }
}

document.getElementById("close_chat").addEventListener("click", (event) => {

    document.getElementById("input_msg").style.visibility="hidden";
    document.getElementById("send_btn").style.visibility="hidden";

    const message = `Deseja realmente finalizar o atendimento?
        <span onclick="confirm_close_chat('close')" class='confirm_close_chat'>Sim</span> |
        <span onclick="confirm_close_chat('back')" class='confirm_close_chat'>Voltar</span>`;

    const data = {
        room,
        username: "alobebe",
        message
    }

    socket.emit("message", data);

});