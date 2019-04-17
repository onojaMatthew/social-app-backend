const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");
const filter = require("./fileFilter");
require("dotenv").config();

module.exports = (options = {}) => multer({
  storage: multerGoogleStorage.storageEngine({
    keyFilename: "./google-config.json",
    projectId: process.env.BUCKET_ID,
    bucket: process.env.BUCKET,
    ...options
  })
})
