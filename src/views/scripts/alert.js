socket.once("error", (err) => {
    document.querySelector(".input").innerHTML = 
    `<div class="alert alert-danger alert-white rounded">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <div class="icon"><i class="fa fa-times-circle"></i></div>
        <strong>Ocorreu um erro! </strong><br> ${err}.
        </div>
    </div>
    `
});