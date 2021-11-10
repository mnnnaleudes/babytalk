const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");
const level = urlSearch.get("level");
const email = urlSearch.get("email");
const assunto = urlSearch.get("assunto");

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

    console.log(data);

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
        socket.emit("close_room", {
            room
        });
    }

}

document.getElementById("close_chat").addEventListener("click", (event) => {

    const message = `Deseja realmente finalizar o atendimento?
        <span onclick="confirm_close_chat('close')" class='confirm_close_chat'>Sim</span> |
        <span onclick="confirm_close_chat('back')" class='confirm_close_chat'>Voltar</span>`;

    const data = {
        room,
        username,
        message
    }

    socket.emit("message", data);

});
