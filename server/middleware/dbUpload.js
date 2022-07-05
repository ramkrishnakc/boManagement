const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");

const { config } = require("../config");

const ALLOWED_TYPES = ["application/pdf"];

const DbStorage = new GridFsStorage({
  url: config.dbUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      if (!req.params.refId) {
        reject("No Reference Id provided");
      }

      const fileInfo = {
        filename: file.originalname,
        bucketName: "bookResources",
        metadata: {
          refId: req.params.refId,
        },
      };
      resolve(fileInfo);
    });
  }
});

const DbUpload = multer({
  storage: DbStorage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error(`Only ${ALLOWED_TYPES.join(", ")} formats are allowed!`));
    }
  }
});

module.exports = DbUpload;
