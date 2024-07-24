function handleClipboardCopy(req, res) {
    const clipboardData = req.body.text;
    const io = req.app.get("socketio")
    if (clipboardData) {
        io.emit("text update", clipboardData);
        res.status(200).json({ message: "Clipboard data broadcasted successfully" });
    } else {
        res.status(400).json({ message: "No clipboard data received" });
    }
}

module.exports = { handleClipboardCopy }