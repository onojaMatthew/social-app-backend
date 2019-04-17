

module.exports = files => (req, file, cb) => {
    cb(null, files.every(key => file.mimetype.includes(key)))
}