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

new_chat_button.addEventListener("click", (event) => {
    const date = new Date();

    const new_chat = document.querySelector(".txt");
    const old_html = new_chat.innerHTML;

    new_chat.innerHTML = 
    `
    <br>
    <input type="text" placeholder="Nome da sala..." class="temp_input" style="width: 50%; margin-top: 25px; margin-bottom: 25px;" required>
    `

    const handle_input = (event) => {
        const input_value = document.querySelector(".temp_input").value;

        if (!input_value) {
            return;
        }

        if (event.key == "Enter") {
            socket.emit("create_new_chat", input_value);
            document.querySelector(".temp_input").removeEventListener("keydown", handle_input);
            new_chat.innerHTML = old_html;
        }
    }

    document.querySelector(".temp_input").addEventListener("keydown", handle_input);
});