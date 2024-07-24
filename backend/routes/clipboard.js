const express = require("express")
const router = express.Router()
const { handleClipboardCopy } = require("../controllers/clipboardController")

router.post("/", handleClipboardCopy)

module.exports = router