const socket = io();

socket.on("newchat", (data) => {

    createChat(data);

});

function createChat(data){

    const inbox = document.getElementById("chat_online");

    if(inbox !== null) {

        inbox.innerHTML += `
        <div class="chat_ib" onclick="window.open('http://localhost:3000/support.html?username=Robs&select_room=${data.room}&level=suport&email=rob@alobebe.com.br','_self')">
            <h5>
                <span>${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                <span>${data.username}</span>
                <span>${data.email}</span>
                <span>${data.assunto}</span>
            </h5>
        </div>`;

        inbox.scrollTop = 0;
    }


    const notifications = document.getElementById("notifications");

    if(notifications !== null) {

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
                <button class="agree" onclick="window.open('http://localhost:3000/support.html?username=Robs&select_room=${data.room}&level=suport&email=rob@alobebe.com.br','_self')">ATENDER</button>
                <button id="deny_chat" class="deny">FECHAR</button>
            </div>
        </div>`;
    }

}

document.getElementById("deny_chat").addEventListener("click", (event) => {

    let notifications = document.getElementById("notifications").getElementsByTagName("div");
    let len = notifications.length;

    console.log(len)

    for (let i = 0; i < len; i++) {
        if (notifications[i].className.toLowerCase() == "notification") {
            notifications[i].parentNode.removeChild(notifications[i]);
        }
    }

});