require("dotenv").config()
const fs = require("fs")
const path = require("path")
const uploads_folder_name = process.env.UPLOADS_FOLDER_NAME
const uploadsPath = `./public/${uploads_folder_name}`

function handleGetAllFiles(req, res) {
    console.log(uploadsPath)
    fs.readdir(`${uploadsPath}/`, (err, files) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Unable to scan files.');
        }
        res.json(files);
    });
}

function handleDeleteFile(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, `../public/${uploads_folder_name}`, filename);
    console.log(filePath)
    const io = req.app.get("socketio")

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file.');
        }
        io.emit('file upload');
        return res.send('File deleted successfully.');
    });
}

module.exports = {
    handleGetAllFiles,
    handleDeleteFile
}