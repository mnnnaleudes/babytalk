const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const email = urlSearch.get("email");

const statusChat = {
    1:"online",
    2:"offline",
    3:"andamento",
    4:"finalizado"
};

/*
 *
 *
 Criar support
 *
 */
//createSuport(username, email, room)

const status = "online";

// create a JSON object
const json = {
    name: username,
    email: email,
    status: status
};

// request options
const options_support = {
    method: 'PUT',
    body: JSON.stringify(json),
    headers: {
        'Content-Type': 'application/json'
    }
}

// send post request
fetch('http://localhost:3001/support', options_support)
    .then(res => res.text())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.error(err));

socket.emit("open_support", {
    username,
    email,
    status
});

console.log("Blah");

/*
 *
 *
 get chats and request options
 *
 */

const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

// send post request
fetch('http://localhost:3001/room', options)
    .then(res => res.text())
    .then(data => {

        let messages = JSON.parse(data);

        for(let i=0; i<messages.length; i++){

            createChat(messages[i]);

        }

    })
    .catch(err => console.error(err));

socket.on("newchat", (data) => {

    console.log("hey there!");
    createChat(data);

});

function createChat(data){

    //remover uso da username...
    if(data.client_name !== undefined){
        data.username = data.client_name;
    }

    if(data.client_email !== undefined){
        data.email = data.client_email;
    }

    if(data.subject !== undefined){
        data.assunto = data.subject;
    }

    if(data._id !== undefined){
        data.room = data._id;
    }

    if(data.status === undefined) {
        data.status = 1;
    }

    const inbox = document.getElementById("chat_"+statusChat[data.status]);

    if(inbox !== null) {

        inbox.innerHTML += `
        <div class="chat_ib" onclick="window.open('http://localhost:3001/support.html?username=Robs&select_room=${data.room}&level=suport&email=rob@alobebe.com.br','_self')">
            <h5>
                <span>${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                <span>${data.username}</span>
                <span>${data.email}</span>
                <span>${data.assunto}</span>
            </h5>
        </div>`;

        inbox.scrollTop = 0;
    }

    if(data.status == 1) {

        const notifications = document.getElementById("notifications");

        if (notifications !== null) {

            notifications.innerHTML += `

            <div class="notification">
                <h2>UM CLIENTE FEZ UMA PERGUNTA</h2>
                <h5>
                    <span>${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                    <span>${data.username}</span>
                    <span>${data.email}</span>
                    <span>${data.assunto}</span>
                </h5>
                <div class="options">
                    <button class="agree" onclick="window.open('http://localhost:3001/support.html?username=Robs&select_room=${data.room}&level=suport&email=rob@alobebe.com.br','_self')">ATENDER</button>
                    <button onclick="deny_chat()" class="deny">FECHAR</button>
                </div>
            </div>`;

        }
    }

}

function deny_chat (){

    let notifications = document.getElementById("notifications").getElementsByTagName("div");
    let len = notifications.length;

    for (let i = 0; i < len; i++) {
        if (notifications[i].className.toLowerCase() == "notification") {
            notifications[i].parentNode.removeChild(notifications[i]);
        }
    }

}
