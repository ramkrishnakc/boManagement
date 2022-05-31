const path = require("path");
const fs = require("fs");
const multer = require("multer");
const uuid = require('uuid');

const DIR = path.resolve(__dirname, "../../", "public");
const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

/* Saving location for the file */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    return cb(null, `${uuid.v4()}.${ext}`);
  }
});

/* Handle file uploads using multer */
const Upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error(`Only ${ALLOWED_TYPES.join(", ")} formats are allowed!`));
    }
  }
});

module.exports = Upload;
