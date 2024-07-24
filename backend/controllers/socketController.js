require("dotenv").config()
const uploads_folder_name = process.env.UPLOADS_FOLDER_NAME
const uploadsPath = `./public/${uploads_folder_name}`
const fs = require("fs")
var ncp = require('node-clipboardy');

function handleSocketRequest(io) {
    io.on("connection", function (socket) {
        console.log("User connected with id:", socket.id);

        socket.on("disconnect", function () {
            console.log("User disconnected with id:", socket.id);
        });

        socket.on("text update", function (data) {
            console.log(data)
            io.emit("text update", data);
            try {
                ncp.writeSync(data);
                console.log("copied successfully")
            }
            catch (e) {
                console.log("copying error")
            }
        });

        socket.on("file upload", () => {
            fs.readdir(`${uploadsPath}/`, (err, files) => {
                if (err) {
                    return;
                }
                io.emit('files update', files);
            });
        });
    });
}

module.exports = { handleSocketRequest }