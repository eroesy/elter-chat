const submit_button = document.querySelector(".submit");
const id = document.querySelector(".hidden").innerHTML;

function filterArrayByRange(array, start, finish) {
    if (start < 0 || start > array.length || finish < 0 || finish > array.length) {
      return [];
    }
  
    return array.filter((_, index) => index < start || index > finish);
}

document.querySelector(".chat").addEventListener("click", (event) => {

    if (event.target.classList[0] == "edit" && !editing) {

        const msg_div = event.target.parentNode.parentNode;
        const msg_id = Number(msg_div.id);
        const original_msg = msg_div.children[0].innerHTML;

        msg_div.innerHTML =
        `
        <div class="edit_msg" id="${msg_id}">
            <textarea id="msg_edit" rows="4" cols="4">${original_msg}</textarea>
            <button style="font-size:32px" class="submit" id="edit_button"><i class="material-icons">send</i></button>
        </div>
        `

        const text_area = document.getElementById("msg_edit");
        const button = document.getElementById("edit_button");

        text_area.style.height = 'auto';
        text_area.style.height = `${text_area.scrollHeight * 2}px`;

        text_area.addEventListener("input", () => {
            text_area.style.height = 'auto';
            text_area.style.height = `${text_area.scrollHeight * 2}px`;
        });

        const clickHandler = () => {
            const all_divs = [...document.querySelector(".chat").children];
            const text = text_area.value;

            const new_messages = filterArrayByRange(all_divs, msg_id, all_divs.length);

            document.querySelector(".chat").innerHTML = "";

            new_messages.forEach((message) => {
                document.querySelector(".chat").appendChild(message);
            });

            append_message(text, false);
            socket.emit("edit_msg", [msg_id, original_msg, text, id]);

            socket.once("replace_msg", (data) => {
                append_message(data, true);
            });

            button.removeEventListener("click", clickHandler);
            text_area.removeEventListener("input", inputHandler);

            editing = false;
        };

        const inputHandler = () => {
            text_area.style.height = 'auto';
            text_area.style.height = `${text_area.scrollHeight * 2}px`;
        };

        button.addEventListener("click", clickHandler);
        text_area.addEventListener("input", inputHandler);

        editing = true;
    }
});

function append_message(content, bot) {

    if (!content)
        return;

    const msg = [...content];
    const chat = document.querySelector(".chat");

    const msgs = document.querySelector(".chat").children.length || 0;
    const msg_id = msgs;

    const element = document.createElement("h1");
    const div = document.createElement("div");
    const bot_h1 = document.createElement("h1");

    div.setAttribute("class", bot ? "msg_bot" : "msg_user");
    bot_h1.setAttribute("class", "bold");
    bot_h1.setAttribute("style", "font-size: 20px; font-weight: 700;");
    bot_h1.innerHTML = "bot:";
    element.setAttribute("id", msg_id);

    if (bot) {

        div.appendChild(bot_h1);
        div.appendChild(element);
        chat.appendChild(div);

        const interval = setInterval(() => {
            element.innerHTML += msg[0];
            msg.splice(0, 1);

            if (msg.length == 0)
                clearInterval(interval);
        }, 10);

    }
    else {
        chat.innerHTML += 
        `
        <div class="msg_${bot ? "bot" : "user"}" id="${msg_id}">
            <h1>${content}</h1>
            <div class="options">
                <h1 class="edit">editar</h1>
            </div>
        </div>
        `;
    }
}

socket.on("msg", (data) => {
    append_message(data, true);
});

submit_button.addEventListener("click", () => {
    const input_text = document.getElementById("msg").value;

    if (!input_text)
        return;

    socket.emit("msg", [false, id, input_text]);
    append_message(input_text, false);
});