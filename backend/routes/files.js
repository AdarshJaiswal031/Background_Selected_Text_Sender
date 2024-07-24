const express = require("express")
const router = express.Router()
const {
    handleGetAllFiles,
    handleDeleteFile
} = require("../controllers/filesController")

router.get("/", handleGetAllFiles)

router
    .route("/:filename")
    .delete(handleDeleteFile)

module.exports = router
