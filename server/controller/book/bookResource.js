const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { BookModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const getPdf = (req, res) => {
  res.send("OK");
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
