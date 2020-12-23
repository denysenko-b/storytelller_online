const multer = require("multer");
const crypto = require('crypto');


const createFileName = async (fileName) => await crypto
    .createHmac('sha256', Math.random().toString())
    .update(Date.now().toString() + fileName)
    .digest('hex')

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => createFileName(file.originalname)
        .then(fileName => {
            const filenameArr = file.originalname.split('.');
            const format = filenameArr[filenameArr.length-1];

            cb(null, fileName + '.' + format);
        })
        .catch(console.log)
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

module.exports = multer({
    storage: storageConfig, fileFilter: fileFilter, limits: {
        fileSize: 1024 * 1024 * 5
    }   
}).single("filedata");