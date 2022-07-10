const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");
const fs = require("fs");

const { logger } = require("../../config");
const { BookModel, UserModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const getPdf = async (req, res) => {
  if (!req.params.refId ||
    !req.params.userId ||
    req.params.userId !== _.get(res, "locals.payload.id")
  ) {
    return sendError(res, 401);
  }

  const userInfo = await UserModel.findOne(
    { _id: ObjectId(req.params.userId) },
    { purchasedBooks: 1 }
  );
  const hasPurchased = (_.get(userInfo, "purchasedBooks", [])).includes(req.params.refId);

  if (!hasPurchased) {
    return sendError(res, 401);
  }

  const file = await global.bucket.find({
    "metadata.refId": req.params.refId,
  }).toArray();

  /* All authorized, found the file - send the file */
  if (Array.isArray(file) && file[0]) {
    try {
      res.set('Content-Type', file[0].contentType);
      res.set('Content-Disposition', 'attachment; filename="' + file[0].filename + '"');

      const fileStream = bucket.openDownloadStream(file[0]._id);
      
      fileStream.on("error", function(err) { 
        res.end();
      });
      
      return fileStream.pipe(res);
    } catch (err) {
      logger.error(`ERROR while reading PDF file: ${err}`);
      return sendError(res, 400);
    }
  }
  return sendError(res, 400);
};

const uploadPdf = async (req, res) => {
  try {
    if (req.params.refId) {
      const files = await global.bucket.find({
        "metadata.refId": req.params.refId,
        "_id": { $nin: [req.file.id]}
      }).toArray();

      const promises = files.map(item => global.bucket.delete(item._id));
      await Promise.all(promises);

      await BookModel.findOneAndUpdate(
        { _id : ObjectId(req.params.refId) },
        { pdf: req.file.filename }
      );
    }
    return sendData(res, null, "Resource added successfully!!");
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const publishPdf = (req, res) => {
  if (!req.params.userId ||
    req.params.userId !== _.get(res, "locals.payload.id")
  ) {
    return sendError(res, 400);
  }

  return uploadPdf(req, res);
};

module.exports = {
  getPdf,
  uploadPdf,
  publishPdf,
};
