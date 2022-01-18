const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
let room = urlSearch.get("select_room");
const level = urlSearch.get("level");
const email = urlSearch.get("email");
const assunto = urlSearch.get("assunto");

/*
Criar cliente
 */
if(level == 'client') {

    let supports = "";

    //verifica se ha atendentes online

    // request options
    const options_support = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // send request
    fetch('http://localhost:3001/support?status=online', options_support)
        .then(res => res.text())
        .then(data => {
            let _supports = JSON.parse(data);
            supports = _supports.length;
        })
        .catch(err => console.error(err));

    if(document.getElementById("room").value === "" || document.getElementById("room").value === undefined){
        createClient(username, level, email, assunto)
    }else{

        let room = document.getElementById("room").value;

        socket.emit("open_room", {
            username,
            room,
            level,
            email,
            assunto,
            supports
        }, (messages, clients) => {
            messages.forEach((message) => createMessage(message));
            clients.forEach((client) => createInbox(client));
        });

    }

}else{

    createSuport(username, email, room)

    const status = "online";

    // create a JSON object
    const json = {
        name: username,
        email: email,
        status: status
    };

    // request options
    const options = {
        method: 'PUT',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // send post request
    fetch('http://localhost:3001/support', options)
        .then(res => res.text())
        .then(data => {
            console.log(data)
        })
        .catch(err => console.error(err));

    console.log(status);

    socket.emit("open_support", {
        username,
        email,
        status
    });

}


document.getElementById("input_msg").addEventListener("keypress", (event) => {

    if(event.key === 'Enter'){

        const message = event.target.value;
        event.target.value = "";

        let room = document.getElementById("room").value;

        const data = {
            room,
            username,
            level,
            message
        }

        socket.emit("message", data);

        let box = document.getElementById("box_msg");
        let message_receives = box.getElementsByClassName("received_msg");

        let box_message = message_receives[message_receives.length-1];

        let message_received = box_message.getElementsByClassName("received_withd_msg")[0];

        let message_received_p = message_received.getElementsByTagName("p")[0];

        let message_received_span = message_received_p.getElementsByTagName("span")[0];

        if(message_received_span !== undefined){

            let subject_msg = message_received_span.dataset.subject;
            let order_msg = message_received_span.dataset.order;

            callanswer(subject_msg, order_msg);

        }

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


socket.on("support_message", (status) => {

    if (status === 'offline'){
        createChatbot('offline');
    }else{
        createChatbot('online');
    }

});


function createClient(username, level, email, assunto){

    let supports = "";

    //verifica se ha atendentes online

    // request options
    const options_support = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // send request
    fetch('http://localhost:3001/support?status=online', options_support)
        .then(res => res.text())
        .then(data => {
            let _supports = JSON.parse(data);
            supports = _supports.length;
        })
        .catch(err => console.error(err));


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
    fetch('http://localhost:3001/room', options)
        .then(res => res.text())
        .then(data => {

            let client = JSON.parse(data);

            let room = client._id;

            document.getElementById("room").value = room;

            socket.emit("open_room", {
                username,
                room,
                level,
                email,
                assunto,
                supports
            }, (messages, clients) => {
                messages.forEach((message) => createMessage(message));
                clients.forEach((client) => createInbox(client));
            });

        })
        .catch(
            err => {
                //console.log(err)
            }
        );


}

function createSuport(username, email, room){
    // create a JSON object
    const json = {
        id: room,
        suport_name: username,
        suport_email: email,
        status: 3
    };

    // request options
    const options = {
        method: 'PUT',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    document.getElementById("room").value = room;

    // send post request
    fetch('http://localhost:3001/room', options)
        .then(res => res.text())
        .then(data => {
            console.log(data)
        })
        .catch(err => console.error(err));

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
}

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

        let hide = false;

        if(data.text.search("confirm_close_chat") > -1 && level != data.level){
            hide = true;
        }

        messageBox.innerHTML +=`
            <div class="incoming_msg ${(hide)?'hide':''}" >
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
            <div class="chat_people" onclick="window.open('http://localhost:3001/support.html?username=Robs&select_room=${data.room}&level=suport&email=rob@alobebe.com.br','_self')">
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

function callanswer(subject,order){

    let message = "";
    let room = document.getElementById("room").value;

    //console.log("order",order);

    if(order != 99){

        // request options
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // send request
        fetch('http://localhost:3001/botmessage?id_option='+subject+'&order='+order, options)
            .then(res => res.text())
            .then(data => {

                let _message = JSON.parse(data).messages;
                let next_order = JSON.parse(data).next;

                //console.log("next",next_order);

                const data_send = {
                    room,
                    username: "alobebe",
                    message: "<span data-subject="+subject+" data-order="+next_order+">"+_message[0].message+"</span>"
                }

                socket.emit("message", data_send);

            })
            .catch(err => console.error(err));

    }else{

        const data_send = {
            room,
            username: "alobebe",
            message: "Em breve entraremos em contato."
        }

        socket.emit("message", data_send);

        confirm_close_chat("close");

    }





}

function chooseSubject(subject){

    let order = 1;

    callanswer(subject,order);

}

function confirm_close_chat(acao){

    if (acao === "close"){

        let room = document.getElementById("room").value;

        // create a JSON object
        const json = {
            id: room,
            status: 4
        };

        // request options
        const options = {
            method: 'PUT',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // send put request
        fetch('http://localhost:3001/room', options)
            .then(res => res.text())
            .then(data => {
                console.log(data)
            })
            .catch(err => console.error(err));

        const message = `${username} finalizou o atendimento`;

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

    let room = document.getElementById("room").value;

    const data = {
        room,
        username: "alobebe",
        level,
        message
    }

    socket.emit("message", data);

});

//Chatbot
function createChatbot(status){

    let room = document.getElementById("room").value;

    if(status == 'offline') {
        let message_off = `
        Olá ${username}, tudo bem?<br/>
        
        Esta ferramenta funciona de
        segunda à sexta-feira das 9h às
        17h30.<br/>
        
        Envie sua mensagem. Nossa equipe
        responderá no próximo dia útil.<br/>
        
        Para iniciar o atendimento, informe  o motivo de seu contato:`;

        let data = {
            room,
            username: "alobebe",
            level,
            message: message_off
        }

        socket.emit("message", data);

        let message_options = `<select id="botsubject" name="subject" onchange="chooseSubject(this.value)">
            <option value="0">Selecione</option>
            <option value="1">Conversar sobre um produto</option>
            <option value="2">Conversar sobre uma compra realizada no site</option>
            <option value="3">Lista de chá de bebê</option>
            <option value="4">Programa Alô Bebê Club</option>
            <option value="5">Programa Alô Bebê Twins</option>
            <option value="6">Dificuldade para navegar no site ou comprar</option>
            <option value="7">Outros assuntos</option>
        </select>`;

        data = {
            room,
            username: "alobebe",
            level,
            message: message_options
        }

        socket.emit("message", data);
    }else{
        message = `
        Olá ${username}, tudo bem?<br/>
            Fale com um atendente via chat.<br/>
        
            Esta ferramenta funciona de
        segunda à sexta-feira das 9h às
        17h30.`;

        const data = {
            room,
            username: "alobebe",
            level,
            message
        }

        socket.emit("message", data);
    }

}