const button = document.querySelector(".submit");
const chat = document.querySelector("#new_chat");
const id = document.querySelector(".hidden").innerHTML;

const socket = io();

function new_chat(name, id) {
    const lateral = document.querySelector(".lateral");

    lateral.innerHTML += 
    `
        <div class="new_chat">
            <h1><a href="/chat/${id}">${name}</a></h1>
        </div>
    `
}

function append_message(content, bot) {

    const msg = [...content];
    const chat = document.querySelector(".chat");

    if (!content)
        return;

    const random_int = Math.floor(Math.random() * 999999999999999);

    const element = document.createElement("h1");
    const div = document.createElement("div");

    div.setAttribute("class", bot ? "msg_bot" : "msg_user");
    element.setAttribute("id", random_int);

    if (bot) {
        div.appendChild(element)
        chat.appendChild(div)
        element.innerHTML += "bot: "
        const interval = setInterval(() => {
            element.innerHTML += msg[0];
            msg.splice(0, 1);

            console.log(msg[0]);

            if (msg.length == 0)
                clearInterval(interval);
        }, 10);

    }
    else {
        chat.innerHTML += 
        `
        <div class="msg_${bot ? "bot" : "user"}">
            <h1>user: ${content}</h1>
        </div>
        `;
    }
}

socket.on("msg", (data) => {
    console.log(data);
    append_message(data, true);
});

socket.on("new_chat", (data) => {
    new_chat(data[1], data[0]);
});

chat.addEventListener("click", (event) => {
    const date = new Date();
    socket.emit("create_new_chat", date.getDate());
});

button.addEventListener("click", () => {
    const input_text = document.getElementById("msg").value;

    if (!input_text)
        return;

    socket.emit("msg", [false, id, input_text]);
    append_message(input_text, false);
});