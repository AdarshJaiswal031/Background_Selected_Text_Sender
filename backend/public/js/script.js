const socket = io()
const notepad = document.getElementById("notepad")
const send = document.getElementById("send")
const copy = document.getElementById("copy")
send.addEventListener("click", function () {
    const text = notepad.value;
    socket.emit("text update", text)
})

socket.on("text update", function (data) {
    notepad.value = data
    navigator.clipboard.writeText(data).then(() => {
        console.log("Text copied!!");
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
})

copy.addEventListener("click", function () {
    navigator.clipboard.writeText(notepad.value).then(() => {
        console.log("Text copied!!");
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
})