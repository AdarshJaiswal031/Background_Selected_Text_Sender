require("dotenv").config()
const multer = require('multer');
const uploads_folder_name = process.env.UPLOADS_FOLDER_NAME
const uploadsPath = `./public/${uploads_folder_name}`
console.log(uploadsPath)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${uploadsPath}/`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

module.exports = upload