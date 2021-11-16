const socket = io();

socket.on("newchat", (data) => {

    createChat(data);

});

function createChat(data){

    console.log(data);

    const inbox = document.getElementById("chat_online");

    if(inbox !== null) {

        inbox.innerHTML += `
        <div class="chat_ib">
            <h5>
                <span>${dayjs(data.createdAt).format("DD/MM - HH:mm")}</span>
                <span>${data.username}</span>
                <span>${data.email}</span>
                <span>${data.assunto}</span>
            </h5>
        </div>`;

        inbox.scrollTop = 0;
    }

}