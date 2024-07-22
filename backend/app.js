const express = require("express");//working in drag_n_drop branch
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
var ncp = require('node-clipboardy');
const cors = require("cors")
app.use(cors())
app.use(express.json());


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    console.log("User connected with id:", socket.id);

    socket.on("disconnect", function () {
        console.log("User disconnected with id:", socket.id);
    });

    socket.on("text update", function (data) {
        socket.broadcast.emit("text update", data);
        try {
            ncp.writeSync(data);
            console.log("copied successfully")
        }
        catch (e) {
            console.log("copying error")
        }
    });
});

app.get("/", function (req, res) {
    return res.render("index");
});
app.post("/clipboard", function (req, res) {
    console.log(req.body.text)
    const clipboardData = req.body.text;
    if (clipboardData) {
        io.emit("text update", clipboardData);
        res.status(200).json({ message: "Clipboard data broadcasted successfully" });
    } else {
        res.status(400).json({ message: "No clipboard data received" });
    }
});


server.listen(3000, function () {
    console.log('Server is running on port 3000');
});
