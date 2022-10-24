const { swal } = require("./sweetalert.min");

function message(title, text, icon) {
    swal({
        title: title,
        text: text,
        icon: icon
    });
}