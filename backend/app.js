const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
var ncp = require('node-clipboardy');
const cors = require("cors");
const multer = require('multer');
const os = require('os');
const fs = require("fs");
const qrcode = require('qrcode-terminal');
const ipAddress = getLocalIPv4(); // Use the function to get the IP address
const port = 3000;
app.use(cors({
    origin: '*', // Allow all origins
}));
app.use(express.json());
app.set("view engine", "ejs");
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



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

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

    socket.on("file upload", () => {
        fs.readdir('uploads/', (err, files) => {
            if (err) {
                return;
            }
            io.emit('files update', files);
        });
    });
});

app.get("/", function (req, res) {
    return res.render("index");
});

app.post("/clipboard", function (req, res) {
    console.log(req.body.text);
    const clipboardData = req.body.text;
    if (clipboardData) {
        io.emit("text update", clipboardData);
        res.status(200).json({ message: "Clipboard data broadcasted successfully" });
    } else {
        res.status(400).json({ message: "No clipboard data received" });
    }
});

app.post('/upload', upload.single('file'), (req, res) => {
    io.emit('files update');  // Notify all clients about the new file
    res.send('File uploaded successfully.');
});

app.get('/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files.');
        }
        res.json(files);
    });
});

app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file.');
        }
        io.emit('files update');  // Notify all clients about the file deletion
        res.send('File deleted successfully.');
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    const url = `http://${ipAddress}:${port}`;
    console.log(url)
    qrcode.generate(url, { small: true }, (qrCode) => {
        console.log('QR Code for accessing the website:');
        console.log(qrCode);
    });
});
