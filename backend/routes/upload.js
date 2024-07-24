const express = require("express")
const router = express.Router()
const upload = require("../middlewares/uploadMiddleware")
const { handleUploadFile } = require("../controllers/uploadController")

router.post("/", upload.array('files[]'), handleUploadFile)

module.exports = router
