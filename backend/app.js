const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const cors = require("cors");
const os = require('os');
const fs = require("fs");
const qrcode = require('qrcode-terminal');
const ipAddress = getLocalIPv4();
const port = 3000;
const uploadsPath = "public/uploads"
const { handleSocketRequest } = require("./controllers/socketController")

//------------------- mvc imports ------------------
const filesRouter = require("./routes/files")
const clipboardRouter = require("./routes/clipboard")
const uploadRouter = require("./routes/upload")

//-------------------------------------------

app.use(cors({
    origin: '*', // Allow all origins
}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("socketio", io)
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

function getLocalIPv4() {
    const networkInterfaces = os.networkInterfaces();
    for (const iface in networkInterfaces) {
        for (const alias of networkInterfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost'; // Fallback if no IPv4 address is found
}

handleSocketRequest(io)

app.get("/", function (req, res) {
    return res.render("index");
});

app.use("/clipboard", clipboardRouter)
app.use("/upload", uploadRouter)
app.use("/files", filesRouter)


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    const url = `http://${ipAddress}:${port}`;
    console.log(url)
    qrcode.generate(url, { small: true }, (qrCode) => {
        console.log('QR Code for accessing the website:');
        console.log(qrCode);
    });
});
