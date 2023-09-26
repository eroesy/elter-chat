const button = document.querySelector(".submit");
const chat = document.querySelector("#new_chat");

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

socket.on("new_chat", (data) => {
    console.log(data);
    new_chat(data[1], data[0]);
});

chat.addEventListener("click", (event) => {
    const date = new Date();
    socket.emit("create_new_chat", date.getDate());
});