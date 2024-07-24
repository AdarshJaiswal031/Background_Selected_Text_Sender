function handleUploadFile(req, res) {
    const io = req.app.get("socketio")
    io.emit('files update');
    return res.send('Files uploaded successfully.');
}

module.exports = { handleUploadFile }